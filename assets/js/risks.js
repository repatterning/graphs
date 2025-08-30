var Highcharts;


jQuery.getJSON('../warehouse/risks/points/0001.json', function (source)  {

    // https://api.highcharts.com/highstock/plotOptions.series.dataLabels
    // https://api.highcharts.com/class-reference/Highcharts.Point#.name
    // https://api.highcharts.com/highstock/tooltip.pointFormat


    let estimates = [];


    // split the data set into ...
    for (let i = 0; i < source.length; i += 1) {

        let indices = source[i]['columns'];
        let i_max = indices.indexOf('maximum'),
            i_lat = indices.indexOf('latest'),
            i_med = indices.indexOf('median'),
            i_sta_n = indices.indexOf('station_name'),
            i_riv = indices.indexOf('river_name');


        let data = [];
        for (let j = 0; j < source[i]['data'].length; j += 1) {

            data.push({
                x: source[i]['data'][j][i_lat], // maximum
                y: source[i]['data'][j][i_max], // latest
                name: source[i]['data'][j][i_sta_n] // station name
                // description: 'River: ' + source[i]['data'][j][i_riv] + ', Median: ' + source[i]['data'][j][i_med] + ' mm/hr'
            });

        }

        estimates.push({
            type: 'scatter',
            name: source[i]['catchment_name'],
            data: data,
            className: source[i]['catchment_name'], // for point classification by catchment
            tooltip: {
                pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {series.name} </b>:<br/>' +
                    'name: {point.name}<br/> maximum: {point.y:,.3f}<br/>latest: {point.x:,.3f}<br/>'
            }
        });

    }


    Highcharts.setOptions({
        lang: {
            thousandsSep: ','
        }
    });


    // Draw a graph
    Highcharts.chart('container0002', {

        chart: {
            type: 'scatter',
            zoomType: 'xy'
        },

        title: {
            text: 'Spot: '
        },

        subtitle: {
            text: '<p>Rates of Change: Level</p> <br/><br/>'
        },

        time: {
            timezone: 'Europe/London'
        },

        credits: {
            enabled: false
        },

        legend: {
            enabled: true
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

        xAxis: {
            title: {
                text: 'latest (mm/hr)'
            },
            labels: {
                format: '{value}'
            }
        },

        yAxis: {
            labels: {
                format: '{value}'
            },
            title: {
                text: 'maximum (mm/hr)',
                x: 0
            }
        },

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

        series: estimates,
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



