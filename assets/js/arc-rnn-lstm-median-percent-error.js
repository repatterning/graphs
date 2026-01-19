// noinspection DuplicatedCode

var Highcharts;
var optionSelected;
var dropdown = $('#option_selector');
var endpoint = document.getElementById("endpoint").getAttribute("url")
var url = endpoint + '/catchments.json';


// Dropdown: Launch
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


// Dropdown: Select
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


    // Relative to Amazon S3 (Simple Storage Service) Set Up
    $.getJSON(endpoint + '/aggregates.json', function (data) {

        // https://api.highcharts.com/highstock/plotOptions.series.dataLabels
        // https://api.highcharts.com/class-reference/Highcharts.Point#.name
        // https://api.highcharts.com/highstock/tooltip.pointFormat

        let source = data[fileNameKey];

        // splits
        var training = [],
            testing = [];

        // training
        let ctr = source['training']['columns'];
        let tr_sn = ctr.indexOf('station_name'),
            tr_mpe = ctr.indexOf('median_pe');

        let categories_tr = [];
        for (let k = 0;  k < source['training']['data'].length; k += 1) {
            categories_tr.push(source['training']['data'][k][tr_sn]);
        }

        // y: source['training']['data'][i][tr_mpe]
        for (let i = 0; i < source['training']['data'].length; i += 1) {
            training.push(source['training']['data'][i][tr_mpe]);
        }

        // testing
        let cte = source['testing']['columns'];
        let te_sn = cte.indexOf('station_name'),
            te_mpe = cte.indexOf('median_pe');

        let categories_te = [];
        for (let k = 0;  k < source['testing']['data'].length; k += 1) {
            categories_te.push(source['training']['data'][k][te_sn]);
        }

        // y: source['testing']['data'][j][te_mpe]
        for (let j = 0; j < source['testing']['data'].length; j += 1) {
            testing.push(source['testing']['data'][j][te_mpe]);
        }


        // Draw a graph
        Highcharts.chart('container0003', {

            chart: {
                type: 'bar',
                zoomType: 'xy',
                lineWidth: 0.5,
                events: {
                    load: function() {
                        let barHeight = 20;
                        this.update({
                            chart: {
                                height: barHeight * this.pointCount + (this.chartHeight - this.plotHeight)
                            }
                        })
                    }
                }
            },


            title: {
                text: 'Errors: ' + source['catchment_name'] + ' Catchment'
            },

            subtitle: {
                text: '<p>The median percentage errors per gauge station<br>within the ' + source['catchment_name'] + ' catchment area.</p>'
            },

            time: {
                // timezone: 'Europe/London'
            },

            credits: {
                enabled: false
            },

            caption: {
                text: '<p></p>'
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

            xAxis: [
                {
                    categories: categories_tr
                },
                {
                    categories: categories_te
                }
            ],

            yAxis: {
                labels: {
                    x: 0
                },
                title: {
                    text: 'median percentage errors<br>',
                    x: 0
                },
                gridLineWidth: 0.25,
                gridLineColor: '#000000',
                resize: {
                    enabled: true
                }
            },

            plotOptions: {
                bar: {
                    pointPadding: 0.2,
                    pointWidth: 5,
                    borderWidth: 0,
                },
                series: {
                    groupPadding: 0.25
                }
            },

            tooltip: {
                split: true
            },

            series: [
                {
                    type: 'bar',
                    name: 'training stage',
                    data: training,
                    color: '#000000',
                    tooltip: {
                        pointFormat: '<br/><span style="color:{point.color}">\u25CF</span> <b> {series.name} </b>: ' +
                            '{point.y:,.3f}, {point.x}<br/>'
                    }
                },
                {
                    type: 'bar',
                    name: 'testing stage',
                    data: testing,
                    color: '#ff8c00',
                    tooltip: {
                        pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {series.name} </b>: ' +
                            '{point.y:,.3f}, {point.x}<br/>'
                    }
                }
            ]
        });

    }).fail(function () {
        console.log("Missing");
        $('#container0003').empty();
    });

}
