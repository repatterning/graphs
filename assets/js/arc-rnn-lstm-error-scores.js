// noinspection DuplicatedCode

var Highcharts;
var optionSelected;
var dropdown = $('#option_selector');
var endpoint = document.getElementById("endpoint").getAttribute("url")


$.getJSON(endpoint + '/aggregates.json', function (data) {

    // https://api.highcharts.com/highstock/plotOptions.series.dataLabels
    // https://api.highcharts.com/class-reference/Highcharts.Point#.name
    // https://api.highcharts.com/highstock/tooltip.pointFormat

    let source = data;

    var __training = [],
        __testing = [];

    // per catchment
    for (let i = 0; i < source.length; i += 1) {


        // splits
        var training = [],
            testing = [];


        // training metrics: per gauge station
        let ctr = source[i]['training']['columns'];
        let tr_sn = ctr.indexOf('station_name'),
            tr_mpe = ctr.indexOf('median_pe'),
            tr_r_mse = ctr.indexOf('r_median_se');

        for (let j = 0; j < source[i]['data'].length; j += 1) {
            training.push({
                x: source[i]['data'][j][tr_r_mse], // root median square error
                y: source[i]['data'][j][tr_mpe], // median percentage error
                name: source[i]['data'][j][tr_sn] + '<br/>', // station name / catchment name
                description:  Highcharts.numberFormat(source[i]['data'][j][tr_mpe], 4) + '<br/>' +
                    '<b>root median square error:</b> ' + Highcharts.numberFormat(source[i]['data'][j][tr_r_mse], 4) + '<br/>'
            });
        }

        __training.push({
            type: 'scatter',
            name: source[i]['catchment_name'],
            data: training,
            className: source[i]['catchment_name'], // for point classification by catchment
            tooltip: {
                pointFormat: '<br/>' +
                    '<b>gauge station:</b> {point.name}<br/>' +
                    '<b>catchment:</b> {series.name}' +
                    '<b>median percentage error:</b> {point.description}'

            }
        });


        // testing metrics: per gauge station
        let cte = source[i]['testing']['columns'];
        let te_sn = cte.indexOf('station_name'),
            te_mpe = cte.indexOf('median_pe'),
            te_r_mse = cte.indexOf('r_median_se');

        for (let j = 0; j < source[i]['data'].length; j += 1) {
            testing.push({
                x: source[i]['data'][j][te_r_mse], // root median square error
                y: source[i]['data'][j][te_mpe], // median percentage error
                name: source[i]['data'][j][te_sn] + '<br/>', // station name / catchment name
                description:  Highcharts.numberFormat(source[i]['data'][j][te_mpe], 4) + '<br/>' +
                    '<b>root median square error:</b> ' + Highcharts.numberFormat(source[i]['data'][j][te_r_mse], 4) + '<br/>'
            });
        }

        __testing.push({
            type: 'scatter',
            name: source[i]['catchment_name'],
            data: testing,
            className: source[i]['catchment_name'], // for point classification by catchment
            tooltip: {
                pointFormat: '<br/>' +
                    '<b>gauge station:</b> {point.name}<br/>' +
                    '<b>catchment:</b> {series.name}' +
                    '<b>median percentage error:</b> {point.description}'

            }
        });

    }


    // formatting: numbers
    Highcharts.setOptions({
        lang: {
            thousandsSep: ','
        }
    });

    // Draw
    Highcharts.chart('container0002', {

        chart: {
            type: 'scatter',
            zoomType: 'xy'
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
            text: '<p>training & testing stages</p>'
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
                text: 'median percentage error'
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
                text: 'median percentage error:<br>training stage'
            },
            lineWidth: 1,
            height: '48.5%'
        }, {
            labels: {
                align: 'left'
            },
            title: {
                text: 'median percentage error:<br>testing stage'
            },
            lineWidth: 1,
            height: '48.5%',
            top: '50%',
            offset: 0
        }],

        plotOptions: {
            series: {
                turboThreshold: 4000
            }
        },

        series: [
            __training, __testing
        ]

    });



}).fail(function () {
    console.log("Missing");
    $('#container0002').empty();
});


