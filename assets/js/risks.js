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
                i_riv = indices.indexOf('river_name');


            let data = [];
            for (let j = 0; j < source[i]['data'].length; j += 1) {

                data.push({
                    x: source[i]['data'][j][i_lat], // maximum
                    y: source[i]['data'][j][i_max], // latest
                    name: source[i]['data'][j][i_sta_n], // station name
                    description: 'River: ' + source[i]['data'][j][i_riv] + ', Median: ' + source[i]['data'][j][i_med] + ' mm/hr'
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
                zoomType: 'xy'
            },

            title: {
                text: 'Rates of Change of River Levels'
            },

            subtitle: {
                useHTML: true,
                text: '<p>vis-à-vis Scotland\'s river level gauge station measures.</p>' +
                    '<a href="/warehouse/risks/maps/' + fileNameKey + '.html" class="btn btn-sm btn-outline-primary" target="_blank" ' +
                    'onclick="window.open(\'/warehouse/risks/maps/0001.html\', \'_blank\', \'width=999,height=690\'); return false;">' +
                    'MAP</a>'
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
                    text: 'latest (mm/hr)'
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
                    text: 'maximum (mm/hr)',
                    x: 0
                }
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
                        maxWidth: 700
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
