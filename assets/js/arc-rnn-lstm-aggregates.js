var Highcharts;
var optionSelected;
var dropdown = $('#option_selector');
var url = '../assets/descriptors/stages.json';


$.getJSON(url, function (data) {

    $.each(data, function (key, entry) {
        dropdown.append($('<option></option>').attr('value', entry.desc).text(entry.name));
    });

    // Load the first Option by default
    var defaultOption = dropdown.find("option:first-child").val();
    optionSelected = dropdown.find("option:first-child").text();

    // Generate
    generateChart(defaultOption);

});


// Dropdown
dropdown.on('change', function (e) {

    $('#option_selector_title').remove();

    // Save name and value of the selected option
    optionSelected = this.options[e.target.selectedIndex].text;
    var valueSelected = this.options[e.target.selectedIndex].value;

    //Draw the Chart
    generateChart(valueSelected);
});


// Generate graphs
function generateChart(fileNameKey) {

    $.getJSON('../warehouse/arc-rnn-lstm-metrics/aggregates/aggregates.json', function (source) {

        // https://api.highcharts.com/highstock/plotOptions.series.dataLabels
        // https://api.highcharts.com/class-reference/Highcharts.Point#.name
        // https://api.highcharts.com/highstock/tooltip.pointFormat


        let frame = source[fileNameKey];
        let estimates = [];

        for (let i = 0; i < frame.length; i += 1) {

            // indices ...
            let indices = frame[i]['columns'];
            let i_r_median_se = indices.indexOf('r_median_se'),
                i_median_ape = indices.indexOf('median_ape'),
                i_r_mean_se = indices.indexOf('r_mean_se'),
                i_mean_ape = indices.indexOf('mean_ape'),
                i_sta_n = indices.indexOf('station_name'),
                i_riv = indices.indexOf('river_name');

            // the data points of a catchment section
            let data = [];
            for (let j = 0; j < frame[i]['data'].length; j += 1) {

                data.push({
                    x: frame[i]['data'][j][i_median_ape],
                    y: frame[i]['data'][j][i_r_median_se],
                    name: frame[i]['data'][j][i_sta_n], // station name
                    description: '<b>river:</b> ' + frame[i]['data'][j][i_riv] + '<br/><br/>' +
                        '<b>root mean square<br/>error:</b> ' + Highcharts.numberFormat(frame[i]['data'][j][i_r_mean_se], 4) + '<br/><br/>' +
                        '<b>mean absolute<br/>percentage error:</b> ' + Highcharts.numberFormat(frame[i]['data'][j][i_mean_ape], 4) + '<br>'
                });

            }

            // a catchment structure
            estimates.push({
                type: 'scatter',
                name: frame[i]['catchment_name'],
                data: data,
                tooltip: {
                    pointFormat: '<br/>' +
                        '<b>gauge station:</b> {point.name}<br/>' +
                        '<b>catchment:</b> {series.name}<br/>' +
                        '<b>stage:</b> ' + fileNameKey + '<br/>' +
                        '{point.description}'
                }
            });

        }


        // Formating numbers
        Highcharts.setOptions({
            lang: {
                thousandsSep: ','
            }
        });


        // Draw a graph
        Highcharts.chart('container0002', {

            chart: {
                type: 'scatter',
                zoomType: 'xy'
            },

            title: {
                text: 'Error Metrics'
            },

            subtitle: {
                useHTML: true,
                text: '<p>vis-à-vis prediction models per gauge station</p>'
            },

            time: {
                timezone: 'Europe/London'
            },

            credits: {
                enabled: false
            },

            legend: {
                enabled: true
            },

            exporting: {
                buttons: {
                    contextButton: {
                        menuItems: ['viewFullscreen', 'printChart', 'separator',
                            'downloadPNG', 'downloadJPEG', 'downloadPDF', 'downloadSVG', 'separator',
                            'downloadXLS', 'downloadCSV']
                    }
                }
            },

            xAxis: {
                title: {
                    text: 'median absolute percentage<br>error'
                },
                labels: {
                    format: '{value}'
                }
            },

            yAxis: {
                labels: {
                    format: '{value}'
                },
                title: {
                    text: 'root of the median<br>square error',
                    x: 0
                }
            },

            plotOptions: {
                series: {
                    turboThreshold: 4000
                }
            },

            series: estimates
        });

    }).fail(function () {
        console.log("Missing");
        $('#container0002').empty();
    });


}
