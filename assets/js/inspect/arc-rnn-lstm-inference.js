var Highcharts;
var optionSelected;
var dropdown = $('#option_selector');
var url = '../../../warehouse-t/arc-rnn-lstm-inference/menu/menu.json';


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

    $.getJSON('../../../warehouse-t/arc-rnn-lstm-inference/points/' + fileNameKey + '.json', function (source)  {

        // https://api.highcharts.com/highstock/plotOptions.series.dataLabels
        // https://api.highcharts.com/class-reference/Highcharts.Point#.name
        // https://api.highcharts.com/highstock/tooltip.pointFormat


        // split the data set into ...
        let measures = [],
            approximations = [],
            percentages = [],
            forecasts = [],
            groupingUnits = [[
                'hour',                         // unit name
                [1]                            // allowed multiples
            ]];


        let ctr = source['estimates'].columns;
        let mr = ctr.indexOf('measure'),
            er = ctr.indexOf('e_measure'),
            ape = ctr.indexOf('ape');

        for (var i = 0; i < source['estimates'].data.length; i += 1) {

            measures.push({
                x: source['estimates'].data[i][0], // date
                y: source['estimates'].data[i][mr] // measure
            });

            approximations.push([
                source['estimates'].data[i][0], // date
                source['estimates'].data[i][er] // prediction
            ]);

            percentages.push([
                source['estimates'].data[i][0], // date
                source['estimates'].data[i][ape] // absolute percentage error
            ]);
        }


        let cte = source['forecasts'].columns;
        let ef = cte.indexOf('e_measure');

        for (var j = 0; j < source['forecasts'].data.length; j += 1) {

            forecasts.push({
                x: source['forecasts'].data[j][0], // date
                y: source['forecasts'].data[j][ef] // prediction
            });
        }


        Highcharts.setOptions({
            lang: {
                thousandsSep: ','
            }
        });


        // Draw a graph
        Highcharts.stockChart('container0002', {

            rangeSelector: {
                selected: 0,
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
                text: 'Predictions: ' + optionSelected
            },

            subtitle: {
                text: '<p>River Level Prediction</p> <br/><br/>'
            },

            time: {
                // timezone: 'Europe/London'
            },

            credits: {
                enabled: false
            },

            legend: {
                enabled: true,
                itemStyle: {
                    fontSize: '13px',
                    fontWeight: 400,
                    textOverflow: "ellipsis"
                }
            },

            caption: {
                text: '<p>TR: Training, TE: Testing</p>'
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
                    text: 'river level<br>(metres)',
                    x: 0
                },
                // min: 0,
                height: '60%',
                lineWidth: 2,
                resize: {
                    enabled: true
                }
            }, {
                labels: {
                    align: 'left',
                    x: 5
                },
                title: {
                    text: 'APE<br>(%)',
                    align: 'middle',
                    x: 7
                },
                top: '65%',
                height: '30%',
                offset: 0,
                lineWidth: 2,
                softMax: 0.2,
                softMin: -0.01,
                plotLines: [{
                    value: 0.1,
                    color: '#676161',
                    width: 0.65,
                    label: {
                        text: '0.1%'
                    }
                }]
            }
            ],

            plotOptions:{
                series: {
                    turboThreshold: 4000
                }
            },

            tooltip: {
                split: true,
                dateTimeLabelFormats: {
                    millisecond:"%A, %e %b, %H:%M:%S.%L",
                    second:"%A, %e %b, %H:%M:%S",
                    minute:"%A, %e %b, %H:%M",
                    hour:"%A, %e %b, %H:%M",
                    day:"%A, %e %B, %Y",
                    week:"%A, %e %b, %Y",
                    month:"%B %Y",
                    year:"%Y"
                }

            },

            series: [{
                type: 'spline',
                name: 'Measures: Ground Truth',
                data: measures,
                lineWidth: 3,
                color: '#6B8E23',
                yAxis: 0,
                dataGrouping: {
                    units: groupingUnits
                },
                tooltip: {
                    pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {series.name} </b>: ' +
                        '{point.y:,.3f}m<br/>'
                },
                visible: true
            },

                {
                    type: 'spline',
                    name: 'Measures: Predictions',
                    data: approximations,
                    marker: {
                        enabled: true,
                        symbol: 'circle',
                        radius: 1
                    },
                    lineWidth: 0,
                    color: '#000000',
                    yAxis: 0,
                    dataGrouping: {
                        units: groupingUnits
                    },
                    tooltip: {
                        pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {series.name} </b>: ' +
                            '{point.y:,.3f}m<br/>'
                    },
                    opacity: 0.65,
                    visible: true
                },
                {
                    type: 'spline',
                    name: 'Future: Forecasts',
                    data: forecasts,
                    color: '#917808',
                    yAxis: 0,
                    dataGrouping: {
                        units: groupingUnits
                    },
                    tooltip: {
                        pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {series.name} </b>: ' +
                            '{point.y:,.3f}m<br/>'
                    },
                    visible: true
                },
                {
                    type: 'spline',
                    name: 'Absolute Percentage Error (APE)',
                    data: percentages,
                    marker: {
                        enabled: false
                    },
                    lineWidth: 1,
                    color: '#8e0924',
                    yAxis: 1,
                    dataGrouping: {
                        units: groupingUnits
                    },
                    tooltip: {
                        pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {series.name} </b>: ' +
                            '{point.y:,.3f}%<br/>'
                    },
                    visible: true
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
        $('#container0002').empty();
    });

}

