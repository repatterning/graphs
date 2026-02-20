// noinspection DuplicatedCode

var Highcharts;
var optionSelected;
var dropdown = $('#option_selector');
var url = '../warehouse/anomalies/initial/menu/menu.json';


function __sequence(elements, field) {

    let data = [];

    let names = elements['columns'];
    let i_timestamp = names.indexOf('timestamp'),
        i_field = names.indexOf(field);

    for (let i = 0; i < elements['data'].length; i += 1) {

        data.push({
            x: elements.data[i][i_timestamp], // the date
            y: elements.data[i][i_field] // a field
        });

    }

    return data;

}


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

    // Relative to Amazon S3 (Simple Storage Service) Set Up
    $.getJSON('../warehouse/anomalies/initial/points/' + fileNameKey + '.json', function (source) {

        // https://api.highcharts.com/highstock/plotOptions.series.dataLabels
        // https://api.highcharts.com/class-reference/Highcharts.Point#.name
        // https://api.highcharts.com/highstock/tooltip.pointFormat


        // split the data set into ohlc and medians
        let groupingUnits = [[
                'minute',   // unit name
                [1]      // allowed multiples
            ]];

        let original = __sequence(source['estimates'], 'original'),
            plausible = __sequence(source['p_anomalies'], 'p_anomaly'),
            gaps = __sequence(source['gaps'], 'gap'),
            asymptotes = __sequence(source['asymptotes'], 'asymptote'),
            extremes = __sequence(source['extremes'], 'extreme');

        Highcharts.setOptions({
            lang: {
                thousandsSep: ','
            }
        });

        // Draw a graph
        Highcharts.stockChart('container0033', {

            rangeSelector: {
                selected: 1,
                verticalAlign: 'top',
                floating: false,
                inputPosition: {
                    x: 0,
                    y: 0
                },
                buttonPosition: {
                    x: 0,
                    y: 0
                },
                inputEnabled: true,
                inputDateFormat: '%Y-%m-%d'
            },

            chart: {
                zoomType: 'xy',
                width: 435,
                height: 450
            },

            colorAxis: [{
                stops: [
                    [0, '#ffa500'],
                    [0.5, '#000000'],
                    [1, '#722f37']
                ]
            }],

            title: {
                text: source['station_name']
            },

            subtitle: {
                text: '<p><br/><b>River/Water Spot:</b> ' + source['river_name'] + ', <b>Catchment:</b> ' +
                    source['catchment_name'] + '</p>'
            },

            time: {
                // timezone: 'Europe/London'
            },

            credits: {
                enabled: false
            },

            caption: {
                text: '<p></p>'
            },

            exporting: {
                buttons: {
                    contextButton: {
                        menuItems: [ 'viewFullscreen', 'printChart', 'separator',
                            'downloadPNG', 'downloadJPEG', 'downloadPDF', 'downloadSVG' , 'separator',
                            'downloadXLS', 'downloadCSV']
                    }
                }
            },

            yAxis: [{
                labels: {
                    align: 'left',
                    x: 9
                },
                title: {
                    text: 'series<br>(metres)',
                    x: 0
                },
                height: '47%',
                lineWidth: 2,
                resize: {
                    enabled: true
                }
            }, {
                labels: {
                    align: 'left',
                    x: 9
                },
                title: {
                    text: 'asymptotes:<br>flat lines',
                    x: 0
                },
                top: '50%',
                height: '23.5%',
                offset: 0,
                lineWidth: 2
            }, {
                labels: {
                    align: 'left',
                    x: 9
                },
                title: {
                    text: 'gaps<br>& missing',
                    x: 0
                },
                top: '75%',
                height: '23.5%',
                offset: 0,
                lineWidth: 2
            }
            ],

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

            series: [
                {
                    name: 'original',
                    data: original,
                    type: 'spline',
                    turboThreshold: 4000,
                    dataGrouping: {
                        enabled: true,
                        units: [[
                            'minute',                         // unit name
                            [1]                            // allowed multiples
                        ]],
                        dateTimeLabelFormats: {
                            millisecond: ['%A, %e %b, %H:%M:%S.%L', '%A, %b %e, %H:%M:%S.%L', '-%H:%M:%S.%L'],
                            second: ['%A, %e %b, %H:%M:%S', '%A, %b %e, %H:%M:%S', '-%H:%M:%S'],
                            minute: ['%A, %e %b, %H:%M', '%A, %b %e, %H:%M', '-%H:%M'],
                            hour: ['%A, %e %b, %H:%M', '%A, %b %e, %H:%M', '-%H:%M'],
                            day: ['%A, %e %b, %Y', '%A, %b %e', '-%A, %b %e, %Y'],
                            week: ['Week from %A, %e %b, %Y', '%A, %b %e', '-%A, %b %e, %Y'],
                            month: ['%B %Y', '%B', '-%B %Y'],
                            year: ['%Y', '%Y', '-%Y']
                        }
                    },
                    tooltip: {
                        pointFormat: '<br/><span style="color:{point.color}">\u25CF</span> <b> {series.name} </b>: ' +
                            '{point.low:,.3f}m - {point.high:,.3f}m<br/>'
                    }
                },
                {
                    type: 'spline',
                    name: 'flat lines',
                    data: asymptotes,
                    color: '#43270F',
                    yAxis: 1,
                    dataGrouping: {
                        units: groupingUnits
                    },
                    tooltip: {
                        pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {series.name} </b>: ' +
                            '{point.y:,.2f} m<br/>'
                    }
                },
                {
                    type: 'spline',
                    name: 'gaps',
                    data: gaps,
                    color: '#EE7600',
                    yAxis: 2,
                    dataGrouping: {
                        units: groupingUnits
                    },
                    tooltip: {
                        pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {series.name} </b>: ' +
                            '{point.y:,.2f} m<br/>'
                    }
                },
                {
                    type: 'scatter',
                    name: 'plausible anomalies',
                    data: plausible,
                    color: '#780222',
                    yAxis: 0,
                    dataGrouping: {
                        units: groupingUnits
                    },
                    tooltip: {
                        pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {series.name} </b>: ' +
                            '{point.y:,.2f} m<br/>'
                    }
                },
                {
                    type: 'scatter',
                    name: 'beyond 5% | 95%',
                    data: extremes,
                    color: '#A08E23',
                    yAxis: 0,
                    dataGrouping: {
                        units: groupingUnits
                    },
                    tooltip: {
                        pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {series.name} </b>: ' +
                            '{point.y:,.2f} m<br/>'
                    }
                }
            ],
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
        $('#container0033').empty();
    });

}
