// noinspection DuplicatedCode

var Highcharts;
var optionSelected;
var dropdown = $('#option_selector');
var endpoint = document.getElementById("endpoint").getAttribute("url");


$.getJSON(endpoint + '/statements.json', function (source) {

    // https://api.highcharts.com/highstock/plotOptions.series.dataLabels
    // https://api.highcharts.com/class-reference/Highcharts.Point#.name
    // https://api.highcharts.com/highstock/tooltip.pointFormat


    // The raw data
    let __training = source['training'],
        __testing = source['testing'];


    // For building data arrays
    let training = [],
        testing = [];


    // Training
    for (let i = 0; i < __training.length; i += 1) {

        let data = [];

        // training metrics: per gauge station
        let ctr = __training[i]['columns'];
        let tr_sn = ctr.indexOf('station_name'),
            tr_mpe = ctr.indexOf('median_pe'),
            tr_r_mse = ctr.indexOf('r_median_se'),
            tr_cn = ctr.indexOf('catchment_name');

        for (let j = 0; j < __training[i]['data'].length; j += 1) {
            data.push({
                x: __training[i]['data'][j][tr_r_mse], // root median square error
                y: __training[i]['data'][j][tr_mpe], // median percentage error
                name: __training[i]['data'][j][tr_sn], // station name / catchment name
                description: __training[i]['data'][j][tr_cn] + '<br/>' +
                    '<b>root m.s.e.:</b> {point.x:,.4f}, ' + '<b>median p.e.:</b> {point.y:,.4f}<br/>'
            });
        }

        training.push({
            type: 'scatter',
            name: __training[i]['catchment_name'],
            data: data,
            visible: true,
            className: __training[i]['catchment_name'], // for point classification by catchment
            tooltip: {
                pointFormat: '<br/>' +
                    '<b>gauge station:</b> {point.name}<br/>' +
                    '<b>catchment name:</b> {point.description}'
            }
        });

    }


    // Testing
    for (let i = 0; i < __testing.length; i += 1) {

        let data = [];

        // testing metrics: per gauge station
        let cte = __testing[i]['columns'];
        let te_sn = cte.indexOf('station_name'),
            te_mpe = cte.indexOf('median_pe'),
            te_r_mse = cte.indexOf('r_median_se'),
            te_cn = cte.indexOf('catchment_name');

        for (let j = 0; j < __testing[i]['data'].length; j += 1) {
            data.push({
                x: __testing[i]['data'][j][te_r_mse], // root median square error
                y: __testing[i]['data'][j][te_mpe], // median percentage error
                name: __testing[i]['data'][j][te_sn], // station name / catchment name
                description: __testing[i]['data'][j][te_cn] + '<br/>' +
                    '<b>root m.s.e.:</b> {point.x:,.4f}, ' + '<b>median p.e.:</b> {point.y:,.4f}<br/>'
            });
        }

        testing.push({
            type: 'scatter',
            name: __testing[i]['catchment_name'],
            data: data,
            visible: true,
            className: __testing[i]['catchment_name'], // for point classification by catchment
            tooltip: {
                pointFormat: '<br/>' +
                    '<b>gauge station:</b> {point.name}<br/>' +
                    '<b>catchment name:</b> {point.description}'
            },
            yAxis: 1
        });

    }



    // Draw
    Highcharts.chart('container0002', {

        chart: {
            type: 'scatter',
            zoomType: 'xy',
            width: 585,
            height: 665,
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

        yAxis: [{
            labels: {
                align: 'left'
            },
            title: {
                text: '<p>training stage</p><br><br>'
            },
            lineWidth: 0,
            height: '41.5%'
        }, {
            labels: {
                align: 'left'
            },
            title: {
                text: '<p>testing stage</p><br><br>'
            },
            lineWidth: 0,
            height: '41.5%',
            top: '50%',
            offset: 0
        }],

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

        series: training.concat(testing)

    });


});


