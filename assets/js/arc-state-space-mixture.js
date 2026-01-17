var Highcharts;
var optionSelected;
var dropdown = $('#option_selector');
var url = '../warehouse/arc-state-space-mixture/menu/menu.json';


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

    $.getJSON('../warehouse/arc-state-space-mixture/points/predictions/' + fileNameKey + '.json', function (source)  {

        // https://api.highcharts.com/highstock/plotOptions.series.dataLabels
        // https://api.highcharts.com/class-reference/Highcharts.Point#.name
        // https://api.highcharts.com/highstock/tooltip.pointFormat


        // split the data set into ...
        let observations = [],
            boundary = [],
            estimate = [],
            percentage = [],
            t_observations = [],
            t_boundary = [],
            t_estimate = [],
            t_percentage = [],
            f_boundary = [],
            f_estimate = [],
            groupingUnits = [[
                'hour',                         // unit name
                [1]                            // allowed multiples
            ]];


        let training = source['training'];
        let ctr = training.columns;
        let ltr = ctr.indexOf('lower_q'),
            utr = ctr.indexOf('upper_q'),
            mtr = ctr.indexOf('median'),
            otr = ctr.indexOf('observation'), // original
            pel = ctr.indexOf('p_e_lower_q'),
            peu = ctr.indexOf('p_e_upper_q'); // percentage error

        for (var i = 0; i < training.data.length; i += 1) {

            estimate.push({
                x: training.data[i][0], // date
                y: training.data[i][mtr] // median
            });

            boundary.push([
                training.data[i][0], // date
                training.data[i][ltr], // lower
                training.data[i][utr] // upper
            ]);

            observations.push({
                x: training.data[i][0], // date
                y: training.data[i][otr] // original values
            });

            percentage.push([
                training.data[i][0], // date
                training.data[i][pel], // ...
                training.data[i][peu] // ...
            ]);
        }


        let testing = source['testing'];
        let cte = testing.columns;
        let lte = cte.indexOf('lower_q'),
            ute = cte.indexOf('upper_q'),
            mte = cte.indexOf('median'),
            ote = cte.indexOf('observation'), // original
            ptl = cte.indexOf('p_e_lower_q'),
            ptu = cte.indexOf('p_e_upper_q');

        for (var j = 0; j < testing.data.length; j += 1) {

            t_estimate.push({
                x: testing.data[j][0], // date
                y: testing.data[j][mte] // estimate
            });

            t_boundary.push([
                testing.data[j][0], // date
                testing.data[j][lte], // lower
                testing.data[j][ute] // upper
            ]);

            t_observations.push({
                x: testing.data[j][0], // date
                y: testing.data[j][ote] // original values
            });

            t_percentage.push([
                testing.data[j][0], // date
                testing.data[j][ptl], // ...
                testing.data[j][ptu] // ...
            ]);
        }


        let futures = source['futures'];
        let ctf = futures.columns;
        let ltf = ctf.indexOf('lower_q'),
            utf = ctf.indexOf('upper_q'),
            mtf = ctf.indexOf('median'),
            tsf = ctf.indexOf('date');

        for (var k = 0; k < futures.data.length; k += 1) {

            f_estimate.push({
                x: futures.data[k][tsf], // date
                y: futures.data[k][mtf] // estimate
            });

            f_boundary.push([
                futures.data[k][tsf], // date
                futures.data[k][ltf], // lower
                futures.data[k][utf] // upper
            ]);

        }


        Highcharts.setOptions({
            lang: {
                thousandsSep: ','
            }
        });


        // Draw a graph
        Highcharts.stockChart('container0002', {

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
                zoomType: 'x',
                width: 515,
                height: 625
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
                    text: 'error<br>(%)',
                    align: 'middle',
                    x: 7
                },
                top: '65%',
                height: '30%',
                offset: 0,
                lineWidth: 2
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
                name: 'Predictions (TR)',
                data: estimate,
                color: '#6B8E23',
                yAxis: 0,
                dataGrouping: {
                    units: groupingUnits
                },
                tooltip: {
                    pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {series.name} </b>: ' +
                        '{point.y:,.2f}m<br/>'
                },
                visible: true
            },
                {
                    type: 'arearange',
                    name: 'Predictions Boundaries (TR)',
                    data: boundary,
                    color: '#6B8E23',
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
                            'Upper Boundary: {point.high:,.2f}m<br/>' +
                            'Lower Boundary: {point.low:,.2f}m' + '<br/>'
                    },
                    visible: true
                },
                {
                    type: 'spline',
                    name: 'Ground Truth (TR)',
                    data: observations,
                    marker: {
                        enabled: true
                    },
                    lineWidth: 0,
                    color: '#000000',
                    yAxis: 0,
                    dataGrouping: {
                        units: groupingUnits
                    },
                    tooltip: {
                        pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {series.name} </b>: ' +
                            '{point.y:,.2f}m<br/>'
                    },
                    visible: true
                },
                {
                    type: 'spline',
                    name: 'Predictions (TE)',
                    data: t_estimate,
                    color: '#917808',
                    yAxis: 0,
                    dataGrouping: {
                        units: groupingUnits
                    },
                    tooltip: {
                        pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {series.name} </b>: ' +
                            '{point.y:,.2f}m<br/>'
                    }
                },
                {
                    type: 'arearange',
                    name: 'Predictions Boundaries (TE)',
                    data: t_boundary,
                    color: '#917808',
                    visible: true,
                    yAxis: 0,
                    dataGrouping: {
                        units: groupingUnits
                    },
                    tooltip: {
                        pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {series.name} </b><br/>' +
                            'Upper Boundary: {point.high:,.2f}m<br/>' +
                            'Lower Boundary: {point.low:,.2f}m' + '<br/>'
                    }
                },
                {
                    type: 'spline',
                    name: 'Ground Truth (TE)',
                    data: t_observations,
                    marker: {
                        enabled: true
                    },
                    lineWidth: 0,
                    color: '#000000',
                    yAxis: 0,
                    dataGrouping: {
                        units: groupingUnits
                    },
                    tooltip: {
                        pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {series.name} </b>: ' +
                            '{point.y:,.2f}m<br/>'
                    }
                },
                {
                    type: 'spline',
                    name: 'Future Predictions',
                    data: f_estimate,
                    color: '#100f10',
                    yAxis: 0,
                    dataGrouping: {
                        units: groupingUnits
                    },
                    tooltip: {
                        pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {series.name} </b>: ' +
                            '{point.y:,.2f}m<br/>'
                    }
                },
                {
                    type: 'arearange',
                    name: 'Future Predictions Boundaries',
                    data: f_boundary,
                    color: '#ffa500',
                    visible: true,
                    yAxis: 0,
                    dataGrouping: {
                        units: groupingUnits
                    },
                    tooltip: {
                        pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {series.name} </b><br/>' +
                            'Upper Boundary: {point.high:,.2f}m<br/>' +
                            'Lower Boundary: {point.low:,.2f}m' + '<br/>'
                    }
                },
                {
                    type: 'arearange',
                    name: 'Percentage Error (TR)',
                    data: percentage,
                    color: '#6B8E23',
                    yAxis: 1,
                    dataGrouping: {
                        units: groupingUnits
                    },
                    tooltip: {
                        pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {series.name}</b>: ' +
                            'Upper Boundary: {point.high:,.2f}%<br/>' +
                            'Lower Boundary: {point.low:,.2f}%' + '<br/>'
                    },
                    visible: true
                },
                {
                    type: 'arearange',
                    name: 'Percentage Error (TE)',
                    data: t_percentage,
                    color: '#917808',
                    yAxis: 1,
                    dataGrouping: {
                        units: groupingUnits
                    },
                    tooltip: {
                        pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {series.name}</b>: ' +
                            'Upper Boundary: {point.high:,.2f}%<br/>' +
                            'Lower Boundary: {point.low:,.2f}%' + '<br/>'
                    }
                }
            ]
        });

    }).fail(function() {
        console.log("Missing");
        $('#container0002').empty();
    });

}

