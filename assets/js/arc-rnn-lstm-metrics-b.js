var Highcharts;
var optionSelected;
var dropdown = $('#option_selector');
var url = '../warehouse/arc-rnn-lstm-metrics/disaggregates/menu/menu.json';


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

    $.getJSON('../warehouse/arc-rnn-lstm-metrics/disaggregates/points/' + fileNameKey + '.json', function (source) {

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


        let ctr = source['training'].columns;
        let ape_training = ctr.indexOf('ape'),
            t_training = ctr.indexOf('timestamp');
        for (let i = 0; i < source['training'].data.length; i += 1) {
            training.push({
                x: 0,
                y: source['training'].data[i][ape_training],
                description: Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', source['training'].data[i][t_training])
            });
        }

        let qt = source['q_training'].columns;
        let lw = qt.indexOf('l_whisker'),
            lq = qt.indexOf('l_quartile'),
            me = qt.indexOf('median'),
            uq = qt.indexOf('u_quartile'),
            uw = qt.indexOf('u_whisker');
        q_training = [{
            x: -0.1,
            low: source['q_training'].data[0][lw],
            q1: source['q_training'].data[0][lq],
            median: source['q_training'].data[0][me],
            q3: source['q_training'].data[0][uq],
            high: source['q_training'].data[0][uw]
        }];


        let cte = source['testing'].columns;
        let ape_testing = cte.indexOf('ape');
        for (var j = 0; j < source['testing'].data.length; j += 1) {
            testing.push(
                [1, source['testing'].data[j][ape_testing]] // absolute percentage error
            );
        }

        qt = source['q_testing'].columns;
        lw = qt.indexOf('l_whisker');
        lq = qt.indexOf('l_quartile');
        me = qt.indexOf('median');
        uq = qt.indexOf('u_quartile');
        uw = qt.indexOf('u_whisker');
        q_testing = [{
            x: 1.1,
            low: source['q_testing'].data[0][lw],
            q1: source['q_testing'].data[0][lq],
            median: source['q_testing'].data[0][me],
            q3: source['q_testing'].data[0][uq],
            high: source['q_testing'].data[0][uw]
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
                inverted: true
            },

            title: {
                text: 'Model of: ' + optionSelected
            },

            subtitle: {
                text: '<p>Absolute Percentage Errors</p> <br/><br/>'
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
                text: '<p>a.p.e.: absolute percentage error</p>'
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
                    text: 'absolute percentage error (%)'
                },
                min: -0.01
            },

            plotOptions: {
                series: {
                    turboThreshold: 4000
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
                        pointFormat: 'absolute percentage error: {point.y:.3f}%'
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
                    name: '<b><abbr title="absolute percentage error">a.p.e.</abbr> per point</b>: training stage',
                    data: training,
                    color: 'orange'
                }, {
                    type: 'boxplot',
                    name: '<b><abbr title="absolute percentage error">a.p.e.</abbr> quantiles</b>: training stage',
                    data: q_training,
                    color: 'orange',
                    fillColor: 'orange'
                },
                {
                    type: 'scatter',
                    name: '<b><abbr title="absolute percentage error">a.p.e.</abbr> per point</b>: testing stage',
                    data: testing,
                    color: 'olive'
                },
                {
                    type: 'boxplot',
                    name: '<b><abbr title="absolute percentage error">a.p.e.</abbr> quantiles</b>: testing stage',
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
