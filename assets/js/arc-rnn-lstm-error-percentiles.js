// noinspection DuplicatedCode

var Highcharts;
var optionSelected;
var dropdown = $('#option_selector');
var endpoint = document.getElementById("endpoint").getAttribute("url");


function __instances(elements) {

    // For building data arrays
    let instances = [];

    // Reading through
    for (let i = 0; i < elements.length; i += 1) {

        let data = [];

        // metrics: per gauge station
        let indices = elements[i]['columns'];
        let s_name = indices.indexOf('station_name'),
            l_whisker = indices.indexOf('l_whisker'),
            u_whisker = indices.indexOf('u_whisker'),
            c_name = indices.indexOf('catchment_name');

        for (let j = 0; j < elements[i]['data'].length; j += 1) {
            data.push({
                x: elements[i]['data'][j][l_whisker], // root median square error
                y: elements[i]['data'][j][u_whisker], // median percentage error
                name: elements[i]['data'][j][s_name], // station name / catchment name
                description: elements[i]['data'][j][c_name] + '<br/>' +
                    '<b>p.e. 10<sup>th</sup> percentile:</b> ' + Highcharts.numberFormat(elements[i]['data'][j][l_whisker], 4) + '% <br/>' +
                    '<b>p.e. 90<sup>th</sup> percentile:</b> ' + Highcharts.numberFormat(elements[i]['data'][j][u_whisker], 4) + '% <br/>'
            });
        }

        instances.push({
            type: 'scatter',
            name: elements[i]['catchment_name'],
            data: data,
            visible: true,
            className: elements[i]['catchment_name'], // for point classification by catchment
            tooltip: {
                pointFormat: '<br/>' +
                    '<b>gauge station:</b> {point.name}<br/>' +
                    '<b>catchment name:</b> {point.description}'
            }
        });

    }

    return instances;


}


$.getJSON(endpoint + '/statements.json', function (source) {

    // https://api.highcharts.com/highstock/plotOptions.series.dataLabels
    // https://api.highcharts.com/class-reference/Highcharts.Point#.name
    // https://api.highcharts.com/highstock/tooltip.pointFormat


    // The raw data
    let training = __instances(source['training']),
        testing = __instances(source['testing']);


    // Draw
    Highcharts.chart('container0002', {

        chart: {
            type: 'scatter',
            zoomType: 'xy',
            width: 585,
            height: 465,
            marginRight: 225,
            marginBottom: 155
        },

        legend: {
            enabled: true,
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            maxHeight: 200,
            floating: true,
            y: 85
        },

        title: {
            text: 'Error Percentiles',
            x: -60
        },

        subtitle: {
            useHTML: true,
            text: '<p>error percentiles: $90^{th}$ percentile vs. $10^{th}$ percentile</p>',
            x: -65
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
            title: {
                useHTML: true,
                text: 'lower whisker: $10^{th}$ <i>percentile</i>'
            },
            labels: {
                format: '{value}'
            }
        },

        yAxis: {
            labels: {
                align: 'left'
            },
            title: {
                useHTML: true,
                text: 'upper whisker: $90^{th}$ <i>percentile</i><br><br>'
            },
            lineWidth: 0,
            offset: 35
        },

        plotOptions: {
            scatter: {
                jitter: {
                    x: 0.005,
                    y: 0.005
                },

            },
            series: {
                turboThreshold: 4000
            }
        },

        tooltip: {
            fixed: true,
            useHTML: true,
            style: {
                fontSize: 12
            },
            position: {
                align: 'left',
                verticalAlign: 'bottom',
                relativeTo: 'spacingBox',
                x: 400,
                y: 0
            }
        },

        series: training

    });


    // Draw
    Highcharts.chart('container0004', {

        chart: {
            type: 'scatter',
            zoomType: 'xy',
            width: 585,
            height: 465,
            marginRight: 225,
            marginBottom: 155
        },

        legend: {
            enabled: true,
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            maxHeight: 200,
            floating: true,
            y: 85
        },

        title: {
            text: 'Error Percentiles',
            x: -60
        },

        subtitle: {
            useHTML: true,
            text: '<p>error percentiles: $90^{th}$ percentile vs. $10^{th}$ percentile</p>',
            x: -65
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
            title: {
                useHTML: true,
                text: 'lower whisker: $10^{th}$ <i>percentile</i>'
            },
            labels: {
                format: '{value}'
            }
        },

        yAxis: {
            labels: {
                align: 'left'
            },
            title: {
                useHTML: true,
                text: 'upper whisker: $90^{th}$ <i>percentile</i><br><br>'
            },
            lineWidth: 0,
            offset: 35
        },

        plotOptions: {
            scatter: {
                jitter: {
                    x: 0.005,
                    y: 0.005
                },

            },
            series: {
                turboThreshold: 4000
            }
        },

        tooltip: {
            fixed: true,
            useHTML: true,
            style: {
                fontSize: 12
            },
            position: {
                align: 'left',
                verticalAlign: 'bottom',
                relativeTo: 'spacingBox',
                x: 400,
                y: 0
            }
        },

        series: testing

    });


});


