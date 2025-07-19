var Highcharts;
var optionSelected;
var dropdown = $('#option_selector');
var url = '../warehouse/measures/menu/menu.json';


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
function generateChart(fileNameKey){

    $.getJSON('../warehouse/measures/points/continuous/' + fileNameKey + '.json', function (source)  {


        // split the data set into ...
        let sectors = [],
            groupingUnits = [[
                'hour',                         // unit name
                [1]                            // allowed multiples
            ]];

        // Formatting
        Highcharts.setOptions({
            lang: {
                thousandsSep: ','
            }
        });



        // Draw a graph
        Highcharts.stockChart('container0007', {

            rangeSelector: {
                selected: 2,
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
                type: 'spline',
                zoomType: 'xy'
            },

            colorAxis: [{
                stops: [
                    [0, '#ffa500'],
                    [0.5, '#000000'],
                    [1, '#722f37']
                ]
            }],

            title: {
                text: optionSelected
            },

            subtitle: {
                text: 'Gauge River/Water Spot: ' + source['attributes']['river_name']
            },

            credits: {
                enabled: false
            },

            yAxis: [{
                labels: {
                    align: 'left',
                    x: 9
                },
                title: {
                    text: 'level (metres)',
                    x: 0
                },
                height: '45%',
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
                    text: 'daily range<br>(metres)',
                    x: 0
                },
                top: '50%',
                height: '45%',
                offset: 0,
                lineWidth: 2
            }
            ],

            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: {
                    millisecond:"%e %b %H:%M:%S.%L",
                    second:"%e %b %H:%M:%S",
                    minute:"%e %b %H:%M",
                    hour:"%e %b %H:%M",
                    day:"%e %b %Y",
                    week:"%e %b %Y",
                    month:"%b %Y",
                    year:"%Y"
                },
                title: {
                    text: 'Date'
                }
            },

            caption: {
                text: '<p>A gauge\'s river level measures;  ' +
                    'metres.</p>'
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

            tooltip: {
                share: false,
                split: false,
                dateTimeLabelFormats: {
                    millisecond:"%A, %e %b, %H:%M:%S.%L",
                    second:"%A, %e %b, %H:%M:%S",
                    minute:"%A, %e %b, %H:%M",
                    hour:"%A, %e %b, %H:%M",
                    day:"%A, %e %b, %Y",
                    week:"%A, %e %b, %Y",
                    month:"%A, %e %b, %Y",
                    year:"%Y"
                }

            },

            series: [
                {
                    name: source.attributes['station_name'],
                    data: source.data,
                    type: 'spline',
                    pointStart: source['starting'],
                    pointInterval: source['interval'],
                    turboThreshold: 4000,
                    dataGrouping: {
                        enabled: true,
                        units: groupingUnits,
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
                            '{point.y:,.3f}m<br/>'
                    }
                },
                {
                    name: source.attributes['station_name'],
                    data: source['spreads'].data,
                    type: 'columnrange',
                    pointStart: source['spreads']['starting'],
                    pointInterval: source['spreads']['interval'],
                    turboThreshold: 4000,
                    yAxis: 1,
                    pointWidth: 5,
                    dataGrouping: {
                        enabled: true,
                        units: [[
                            'day',                         // unit name
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


    }).fail(function() {
        console.log("Missing");
        $('#container0007').empty();
    });



}