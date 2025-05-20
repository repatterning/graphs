var Highcharts;
var optionSelected;
var dropdown = $('#option_selector');
var url = '../../warehouse/measurements/menu/contrasts/menu.json';


$.getJSON(url, function (data) {

    $.each(data, function (key, entry) {
        dropdown.append($('<option></option>').attr('value', entry.catchment_id).text(entry.catchment_name));
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
function generateChart(fileNameKey){


    $.getJSON('../../warehouse/measurements/points/contrasts/' + fileNameKey + '.json', function (source)  {


        // Descriptors
        let fields = source.attributes.columns;
        let i_station = fields.indexOf('station_name'),
            i_river = fields.indexOf('river_name');


        // split the data set into ...
        let sectors = [],
            groupingUnits = [[
                'hour',                         // unit name
                [1]                            // allowed multiples
            ]];

        for (var i = 0; i < source.data.length; i += 1) {

            sectors.push({
                name: source.attributes.data[i][i_station],
                data: source.data[i],
                description: source.attributes.data[i][i_river],
                dataGrouping: {
                    enabled: true,
                    units: groupingUnits
                }
            });

        }


        // Formatting
        Highcharts.setOptions({
            lang: {
                thousandsSep: ','
            }
        });


        // Draw a graph
        Highcharts.stockChart('container0005', {

            rangeSelector: {
                selected: 3,
                verticalAlign: 'top',
                floating: false,
                inputPosition: {
                    x: 0,
                    y: 0
                },
                buttonPosition: {
                    x: 0,
                    y: 0
                },
                inputEnabled: true,
                inputDateFormat: '%Y-%m-%d'
            },

            chart: {
                type: 'spline',
                zoomType: 'xy'
            },

            title: {
                text: 'River Levels'
            },

            subtitle: {
                text: 'within a catchment'
            },

            credits: {
                enabled: false
            },

            legend: {
                enabled: true
            },

            xAxis: {
                type: 'datetime'
            },

            caption: {
                text: '<p>Each spline represents a gauge\'s river level measures ' +
                    'across time.</p>'
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

            plotOptions: {
                series: {
                    pointStart: source['starting'],
                    pointInterval: source['interval'],
                    turboThreshold: 4000
                }
            },

            series: sectors,

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
        $('#container0005').empty();
    });



}