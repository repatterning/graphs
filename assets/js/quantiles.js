var Highcharts;
var optionSelected;
var dropdown = $('#option_selector');
var url = '../warehouse/quantiles/menu/menu.json';


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
    $.getJSON('../warehouse/quantiles/points/' + fileNameKey + '.json', function (source) {

        // https://api.highcharts.com/highstock/plotOptions.series.dataLabels
        // https://api.highcharts.com/class-reference/Highcharts.Point#.name
        // https://api.highcharts.com/highstock/tooltip.pointFormat


        // split the data set into ohlc and medians
        var ohlc = [],
            medians = [],
            maxima = [],
            minima = [],
            dataLength = source.data.length,
            groupingUnits = [[
                'day',   // unit name
                [1]      // allowed multiples
            ]],
            i = 0;

        for (i; i < dataLength; i += 1) {

            ohlc.push([
                source.data[i][0], // the date
                source.data[i][2], // lower quartile   open
                source.data[i][5], // upper whisker  high
                source.data[i][1], // lower whisker  low
                source.data[i][4] // upper quartile  close
            ]);

            medians.push({
                x: source.data[i][0], // the date
                y: source.data[i][3] // median
            });

            maxima.push({
                x: source.data[i][0], // the date
                y: source.data[i][7] // maximum
            });

            minima.push({
                x: source.data[i][0], // the date
                y: source.data[i][6] // minimum
            });

        }

        Highcharts.setOptions({
            lang: {
                thousandsSep: ','
            }
        });

        // Draw a graph
        Highcharts.stockChart('container0003', {

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
                zoomType: 'x'
                // borderWidth: 2,
                // marginRight: 100
            },

            title: {
                text: 'Distributions of: ' + optionSelected
            },

            subtitle: {
                text: '<p>River Levels</p> <br/> ' +
                    '<p><b>metres</b></p>'
            },

            time: {
                // timezone: 'Europe/London'
            },

            credits: {
                enabled: false
            },

            legend: {
                enabled: true,
                width: 600,
                x: 100
                // align: 'middle',
                // layout: 'vertical',
                // verticalAlign: 'bottom',
                // y: 10,
                // x: 35
            },

            caption: {
                // verticalAlign: "top",
                text: '<p>Each candlestick illustrates the spread of river level measures ' +
                    'across 24 hours.</p>'
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
                    text: 'river levels<br>(metres)',
                    x: 0
                },
                height: '65%',
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
                    text: 'minima<br>(metres)',
                    x: 0
                },
                top: '67.5%',
                height: '31%',
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

            series: [{
                type: 'candlestick',
                name: 'Distributions of ' + optionSelected,
                data: ohlc,
                dataGrouping: {
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
                    pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {series.name} </b><br/>' +
                        'Upper Whisker: {point.high:,.2f} µg/m3<br/>' +
                        'Upper Quartile: {point.close:,.2f} µg/m3<br/>' +
                        'Lower Quartile: {point.open:,.2f} µg/m3<br/>' +
                        'Lower Whisker: {point.low:,.2f} µg/m3' + '<br/>'
                }
            },
                {
                    type: 'spline',
                    name: 'Median',
                    data: medians,
                    color: '#6B8E23',
                    yAxis: 0,
                    dataGrouping: {
                        units: groupingUnits
                    },
                    tooltip: {
                        pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {series.name} </b>: ' +
                            '{point.y:,.2f} µg/m3<br/>'
                    }
                },
                {
                    type: 'spline',
                    name: 'Maxima',
                    data: maxima,
                    color: '#A08E23',
                    visible: false,
                    yAxis: 0,
                    dataGrouping: {
                        units: groupingUnits
                    },
                    tooltip: {
                        pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {series.name} </b>: ' +
                            '{point.y:,.2f} µg/m3<br/>'
                    }
                },
                {
                    type: 'spline',
                    name: 'Minima',
                    data: minima,
                    color: '#800000',
                    yAxis: 1,
                    dataGrouping: {
                        units: groupingUnits
                    },
                    tooltip: {
                        pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {series.name} </b>: ' +
                            '{point.y:,.2f} µg/m3<br/>'
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
        $('#container0003').empty();
    });

}
