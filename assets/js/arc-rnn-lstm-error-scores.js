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

        // training metrics: per gauge station
        let ctr = elements[i]['columns'];
        let tr_sn = ctr.indexOf('station_name'),
            tr_mpe = ctr.indexOf('median_pe'),
            tr_r_mse = ctr.indexOf('r_median_se'),
            tr_cn = ctr.indexOf('catchment_name');

        for (let j = 0; j < elements[i]['data'].length; j += 1) {
            data.push({
                x: elements[i]['data'][j][tr_r_mse], // root median square error
                y: elements[i]['data'][j][tr_mpe], // median percentage error
                name: elements[i]['data'][j][tr_sn], // station name / catchment name
                description: elements[i]['data'][j][tr_cn] + '<br/>' +
                    '<b>root m.s.e.:</b> ' + Highcharts.numberFormat(elements[i]['data'][j][tr_r_mse], 4) + ' <br/>' +
                    '<b>median p.e.:</b> ' + Highcharts.numberFormat(elements[i]['data'][j][tr_mpe], 4) + ' <br/>'
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
            text: 'Error Metrics'
        },

        subtitle: {
            useHTML: true,
            text: '<p>median percentage errors vs. root median square errors</p>'
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
                text: 'root median square<br>error'
            },
            labels: {
                format: '{value}'
            },
            min: 0
        },

        yAxis: {
            labels: {
                align: 'left'
            },
            title: {
                text: 'TRAINING<br><br>'
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
            text: 'Error Metrics'
        },

        subtitle: {
            useHTML: true,
            text: '<p>median percentage errors vs. root median square errors</p>'
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
                text: 'root median square<br>error'
            },
            labels: {
                format: '{value}'
            },
            min: 0
        },

        yAxis: {
            labels: {
                align: 'left'
            },
            title: {
                text: 'TESTING<br><br>'
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

        series: testing

    });


});


