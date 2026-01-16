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
function generateChart(fileNameKey) {

    $.getJSON(endpoint + '/points/' + fileNameKey + '.json', function (source) {

        // https://api.highcharts.com/highstock/plotOptions.series.dataLabels
        // https://api.highcharts.com/class-reference/Highcharts.Point#.name
        // https://api.highcharts.com/highstock/tooltip.pointFormat


        // The categories
        const categories = ['training', 'testing'];


        // split the data set into ...
        let training = [],
            q_training = [],
            testing = [],
            q_testing = [];


        let frame_tr = source['training'];
        let ctr = frame_tr.columns;
        let ape_training = ctr.indexOf('p_error'),
            t_training = ctr.indexOf('timestamp');
        for (let i = 0; i < frame_tr.data.length; i += 1) {
            training.push({
                x: 0,
                y: frame_tr.data[i][ape_training],
                description: Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', frame_tr.data[i][t_training])
            });
        }

        let frame_trq = source['q_training'];
        let qt = frame_trq.columns;
        let lw = qt.indexOf('l_whisker'),
            lq = qt.indexOf('l_quartile'),
            me = qt.indexOf('median'),
            uq = qt.indexOf('u_quartile'),
            uw = qt.indexOf('u_whisker');
        q_training = [{
            x: -0.1,
            low: frame_trq.data[0][lw],
            q1: frame_trq.data[0][lq],
            median: frame_trq.data[0][me],
            q3: frame_trq.data[0][uq],
            high: frame_trq.data[0][uw]
        }];


        let frame_te = source['testing'];
        let cte = frame_te.columns;
        let ape_testing = cte.indexOf('p_error'),
            t_testing = cte.indexOf('timestamp');
        for (var j = 0; j < frame_te.data.length; j += 1) {
            testing.push({
                x: 1,
                y: frame_te.data[j][ape_testing],
                description: Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', frame_te.data[j][t_testing])
            });
        }

        let frame_teq = source['q_testing'];
        qt = frame_teq.columns;
        lw = qt.indexOf('l_whisker');
        lq = qt.indexOf('l_quartile');
        me = qt.indexOf('median');
        uq = qt.indexOf('u_quartile');
        uw = qt.indexOf('u_whisker');
        q_testing = [{
            x: 1.1,
            low: frame_teq.data[0][lw],
            q1: frame_teq.data[0][lq],
            median: frame_teq.data[0][me],
            q3: frame_teq.data[0][uq],
            high: frame_teq.data[0][uw]
        }];


        Highcharts.setOptions({
            lang: {
                thousandsSep: ','
            }
        });


        // Draw a graph
        Highcharts.chart('container0002', {

            chart: {

                zoomType: 'xy',
                inverted: true,
                height: 365,
                width: 495
            },

            title: {
                text: optionSelected
            },

            subtitle: {
                text: '<p>Error Percentages</p> <br/><br/>'
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
                text: '<p>p.e.: percentage error</p>'
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
                categories: categories,
                title: {
                    text: 'STAGE'
                }
            },

            yAxis: {
                title: {
                    text: 'percentage error (%)'
                }
            },

            plotOptions: {
                series: {
                    turboThreshold: 8000
                },
                scatter: {
                    jitter: {
                        x: 0.1,
                        y: 0
                    },
                    marker: {
                        radius: 2,
                        symbol: 'circle'
                    },
                    tooltip: {
                        pointFormat: 'percentage error: {point.y:.3f}%<br/>{point.description}'
                    }
                },
                boxplot: {
                    tooltip: {
                        headerFormat: '<span style="color:{point.color}">\u25CF</span> <em>Quantiles: {point.key}</em><br/>',
                        pointFormat: '' +
                            'Lower Whisker: {point.low:,.3f}%<br/>' +
                            'Lower Quartile: {point.q1:,.3f}%<br/>' +
                            'Median: {point.median:,.3f}%<br/>' +
                            'Upper Quartile: {point.q3:,.3f}%<br>' +
                            'Upper Whisker: {point.high:,.3f}%<br/>'
                    },
                    whiskerWidth: 3,
                    medianWidth: 1,
                    pointWidth: 6,
                    medianColor: '#000000',
                    stemColor: '#000000',
                    whiskerColor: '#000000'
                }
            },


            series: [
                {
                    type: 'scatter',
                    name: '<b><abbr title="percentage error">p.e.</abbr> per point</b>: training stage',
                    data: training,
                    color: 'orange'
                }, {
                    type: 'boxplot',
                    name: '<b><abbr title="percentage error">p.e.</abbr> quantiles</b>: training stage',
                    data: q_training,
                    color: 'orange',
                    fillColor: 'orange'
                },
                {
                    type: 'scatter',
                    name: '<b><abbr title="percentage error">p.e.</abbr> per point</b>: testing stage',
                    data: testing,
                    color: 'olive'
                },
                {
                    type: 'boxplot',
                    name: '<b><abbr title="percentage error">p.e.</abbr> quantiles</b>: testing stage',
                    data: q_testing,
                    color: 'olive',
                    fillColor: 'olive'
                }
            ]
        });

    }).fail(function () {
        console.log("Missing");
        $('#container0002').empty();
    });

}
