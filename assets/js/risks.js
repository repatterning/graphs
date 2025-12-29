var Highcharts;
var optionSelected;
var dropdown = $('#option_selector');
var url = '../warehouse/risks/menu/menu.json';


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

    $.getJSON('../warehouse/risks/points/' + fileNameKey + '.json', function (source) {

        // https://api.highcharts.com/highstock/plotOptions.series.dataLabels
        // https://api.highcharts.com/class-reference/Highcharts.Point#.name
        // https://api.highcharts.com/highstock/tooltip.pointFormat


        let estimates = [];


        // split the data set into ...
        for (let i = 0; i < source.length; i += 1) {

            let indices = source[i]['columns'];
            let i_max = indices.indexOf('maximum'),
                i_lat = indices.indexOf('latest'),
                i_med = indices.indexOf('median'),
                i_sta_n = indices.indexOf('station_name'),
                i_riv = indices.indexOf('river_name'),
                i_end = indices.indexOf('ending');


            let data = [];
            for (let j = 0; j < source[i]['data'].length; j += 1) {

                data.push({
                    x: source[i]['data'][j][i_lat], // maximum
                    y: source[i]['data'][j][i_max], // latest
                    name: source[i]['data'][j][i_sta_n], // station name
                    description: Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', source[i]['data'][j][i_end]) + '<br>' +
                        '<b>river:</b> ' + source[i]['data'][j][i_riv] + '<br><b>median:</b> ' +
                        Highcharts.numberFormat(source[i]['data'][j][i_med], 4) + ' mm/hr<br>'
                });

            }

            estimates.push({
                type: 'scatter',
                name: source[i]['catchment_name'],
                data: data,
                className: source[i]['catchment_name'], // for point classification by catchment
                tooltip: {
                    pointFormat: '<br/>' +
                        '<b>gauge station:</b> {point.name}<br/>' +
                        '<b>maximum rate:</b> {point.y:,.3f} mm/hr<br/>' +
                        '<b>latest rate:</b> {point.x:,.3f}mm/hr<br/>' +
                        '<b>period ending:</b> {point.description}' +
                        '<b>catchment:</b> {series.name}'
                }
            });

        }


        Highcharts.setOptions({
            lang: {
                thousandsSep: ','
            }
        });


        // Draw a graph
        Highcharts.chart('container0002', {

            chart: {
                type: 'scatter',
                zoomType: 'xy',
                width: 585,
                height: 395,
                marginRight: 225
            },

            legend: {
                enabled: true,
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'top',
                maxHeight: 200,
                floating: true,
                y: 65
            },
            title: {
                useHTML: true,
                text: 'Rates of Change of River Levels' +
                    `<a href='/warehouse/risks/maps/${fileNameKey}.html' ` +
                       `onClick=\"window.open('/warehouse/risks/maps/${fileNameKey}.html', 'newwindow', 'width=999,height=690'); return false;\" target="_blank"> Map</a>`
            },

            subtitle: {
                useHTML: true,
                text: '<p>vis-à-vis Scotland\'s river level gauge station measures.<br>LOGARITHMIC AXES</p>'
            },

            time: {
                timezone: 'Europe/London'
            },

            credits: {
                enabled: false
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
                type: 'logarithmic',
                title: {
                    text: 'latest (mm/hr)'
                },
                labels: {
                    format: '{value}'
                }
            },

            yAxis: {
                type: 'logarithmic',
                labels: {
                    format: '{value}'
                },
                title: {
                    text: 'maximum (mm/hr)',
                    x: 0
                },
                max: 1000
            },

            plotOptions: {
                series: {
                    turboThreshold: 4000
                }
            },

            tooltip: {
                split: true,
                dateTimeLabelFormats: {
                    millisecond: "%A, %e %b, %H:%M:%S.%L",
                    second: "%A, %e %b, %H:%M:%S",
                    minute: "%A, %e %b, %H:%M",
                    hour: "%A, %e %b, %H:%M",
                    day: "%A, %e %B, %Y",
                    week: "%A, %e %b, %Y",
                    month: "%B %Y",
                    year: "%Y"
                }

            },

            series: estimates,
            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 600
                    },
                    chartOptions: {
                        rangeSelector: {
                            inputEnabled: false
                        }
                    }
                }]
            }
        });

    }).fail(function () {
        console.log("Missing");
        $('#container0002').empty();
    });


}
