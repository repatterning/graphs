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
            testing = [];


        let ctr = source['training'].columns;
        let ape_training = ctr.indexOf('ape');
        for (var i = 0; i < source['training'].data.length; i += 1) {

            training.push(
                [0, source['training'].data[i][ape_training]] // absolute percentage error
            );
        }


        let cte = source['testing'].columns;
        let ape_testing = cte.indexOf('ape');
        for (var j = 0; j < source['testing'].data.length; j += 1) {

            testing.push(
                [1, source['testing'].data[j][ape_testing]] // absolute percentage error
            );
        }


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
                text: 'Error: ' + optionSelected
            },

            subtitle: {
                text: '<p>River Level Prediction</p> <br/><br/>'
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

            xAxis: {
                categories: categories,
                title: {
                    text: 'STAGE'
                }
            },

            yAxis: {
                title: {
                    text: 'absolute percentage error'
                }
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
                        pointFormat: 'absolute percentage error: {point.y:.3f}'
                    }
                }
            },


            series: [{
                type: 'scatter',
                name: 'training',
                data: Array.from(training)
            },
                {
                    type: 'scatter',
                    name: 'testing',
                    data: Array.from(testing)
                }
            ]
        });

    }).fail(function () {
        console.log("Missing");
        $('#container0002').empty();
    });

}
