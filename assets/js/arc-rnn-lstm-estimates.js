// noinspection DuplicatedCode

var Highcharts;
var optionSelected;
var dropdown = $('#option_selector');
var endpoint = document.getElementById("endpoint").getAttribute("url")
var url = endpoint + '/menu/menu.json';


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

    $.getJSON( endpoint + '/points/' + fileNameKey + '.json', function (source) {

        // https://api.highcharts.com/highstock/plotOptions.series.dataLabels
        // https://api.highcharts.com/class-reference/Highcharts.Point#.name
        // https://api.highcharts.com/highstock/tooltip.pointFormat


        // split the data set into ...
        let observations = [],
            estimate = [],
            percentage = [],
            t_observations = [],
            t_estimate = [],
            t_percentage = [],
            groupingUnits = [[
                'hour',                         // unit name
                [1]                            // allowed multiples
            ]];


        let ctr = source['training'].columns;
        let etr = ctr.indexOf('e_measure'),
            gtr = ctr.indexOf('measure'), // original
            tre = ctr.indexOf('p_error'); // percentage error

        for (var i = 0; i < source['training'].data.length; i += 1) {

            estimate.push({
                x: source['training'].data[i][0], // date
                y: source['training'].data[i][etr]
            });

            observations.push({
                x: source['training'].data[i][0], // date
                y: source['training'].data[i][gtr] // original values
            });

            percentage.push([
                source['training'].data[i][0], // date
                source['training'].data[i][tre]
            ]);
        }


        let cte = source['testing'].columns;
        let ete = cte.indexOf('e_measure'),
            gte = cte.indexOf('measure'), // original
            tee = cte.indexOf('p_error');

        for (var j = 0; j < source['testing'].data.length; j += 1) {

            t_estimate.push({
                x: source['testing'].data[j][0], // date
                y: source['testing'].data[j][ete] // estimate
            });

            t_observations.push({
                x: source['testing'].data[j][0], // date
                y: source['testing'].data[j][gte] // original values
            });

            t_percentage.push([
                source['testing'].data[j][0], // date
                source['testing'].data[j][tee] // ...
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
                zoomType: 'x',
                width: 535,
                height: 595
            },

            title: {
                text: 'Inference: ' + optionSelected
            },

            subtitle: {
                text: '<p>River Level Predictions</p> <br/><br/>'
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
                        menuItems: ['viewFullscreen', 'printChart', 'separator',
                            'downloadPNG', 'downloadJPEG', 'downloadPDF', 'downloadSVG', 'separator',
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
                    name: 'Percentage Error (TR)',
                    data: percentage,
                    color: '#6B8E23',
                    yAxis: 1,
                    dataGrouping: {
                        units: groupingUnits
                    },
                    tooltip: {
                        pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {series.name}</b>: ' +
                            '{point.y:,.3f}%<br/>'
                    },
                    visible: true
                },
                {
                    type: 'spline',
                    name: 'Percentage Error (TE)',
                    data: t_percentage,
                    color: '#917808',
                    yAxis: 1,
                    dataGrouping: {
                        units: groupingUnits
                    },
                    tooltip: {
                        pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {series.name}</b>: ' +
                            '{point.y:,.3f}%<br/>'
                    }
                }
            ]
        });

    }).fail(function () {
        console.log("Missing");
        $('#container0002').empty();
    });

}

