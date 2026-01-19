// noinspection DuplicatedCode

var Highcharts;
var optionSelected;
var dropdown = $('#option_selector');
var tag = document.getElementById("endpoint").getAttribute("tag")
var endpoint = document.getElementById("endpoint").getAttribute("url");


$.getJSON(endpoint + '/statements.json', function (source) {

    // https://api.highcharts.com/highstock/plotOptions.series.dataLabels
    // https://api.highcharts.com/class-reference/Highcharts.Point#.name
    // https://api.highcharts.com/highstock/tooltip.pointFormat


    // The raw data
    let __data = source[tag];


    // For building data arrays
    let instances = [];


    // Training
    for (let i = 0; i < __data.length; i += 1) {

        let data = [];

        // training metrics: per gauge station
        let ctr = __data[i]['columns'];
        let tr_sn = ctr.indexOf('station_name'),
            tr_mpe = ctr.indexOf('median_pe'),
            tr_r_mse = ctr.indexOf('r_median_se'),
            tr_cn = ctr.indexOf('catchment_name');

        for (let j = 0; j < __data[i]['data'].length; j += 1) {
            data.push({
                x: __data[i]['data'][j][tr_r_mse], // root median square error
                y: __data[i]['data'][j][tr_mpe], // median percentage error
                name: __data[i]['data'][j][tr_sn], // station name / catchment name
                description: __data[i]['data'][j][tr_cn] + '<br/>' +
                    '<b>root m.s.e.:</b> ' + Highcharts.numberFormat(__data[i]['data'][j][tr_r_mse], 4) + ' <br/>' +
                    '<b>median p.e.:</b> ' + Highcharts.numberFormat(__data[i]['data'][j][tr_mpe], 4) + ' <br/>'
            });
        }

        instances.push({
            type: 'scatter',
            name: __data[i]['catchment_name'],
            data: data,
            visible: true,
            className: __data[i]['catchment_name'], // for point classification by catchment
            tooltip: {
                pointFormat: '<br/>' +
                    '<b>gauge station:</b> {point.name}<br/>' +
                    '<b>catchment name:</b> {point.description}'
            }
        });

    }






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
            }
        },

        yAxis: {
            labels: {
                align: 'left'
            },
            title: {
                text: tag
            },
            lineWidth: 0
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

        series: instances

    });


});


