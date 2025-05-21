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
                    units: groupingUnits,
                    dateTimeLabelFormats: {
                        millisecond: ['%A, %e %b, %H:%M:%S.%L', '%A, %b %e, %H:%M:%S.%L', '-%H:%M:%S.%L'],
                        second: ['%A, %e %b, %H:%M:%S', '%A, %b %e, %H:%M:%S', '-%H:%M:%S'],
                        minute: ['%A, %e %b, %H:%M', '%A, %b %e, %H:%M', '-%H:%M'],
                        hour: ['%A, %e %b, %H:%M', '%A, %b %e, %H:%M', '-%H:%M'],
                        day: ['%A, %e %b, %Y', '%A, %b %e', '-%A, %b %e, %Y'],
                        week: ['Week from %A, %e %b, %Y', '%A, %b %e', '-%A, %b %e, %Y'],
                        month: ['%B %Y', '%B', '-%B %Y'],
                        year: ['%Y', '%Y', '-%Y']
                    }
                },
                tooltip: {
                    pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {series.name} </b>: ' +
                        '{point.y:,.3f}m<br/>'
                },
                visible: i < 1,
                showInLegend: true
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
                zoomType: 'xy',
                height: 405,
                width: 665,
                marginRight: 195
            },

            title: {
                text: 'Hourly River Levels'
            },

            subtitle: {
                text: 'Catchment: ' + optionSelected
            },

            credits: {
                enabled: false
            },

            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'top',
                enabled: true,
                // floating: true,
                useHTML: true,
                x: 25,
                y: -5,
                navigation: {
                    activeColor: '#3E576F',
                    animation: true,
                    arrowSize: 12,
                    inactiveColor: '#CCC',
                    enabled: true,
                    style: {
                        fontWeight: 'bold',
                        color: '#333'
                    }
                }
            },

            yAxis: {
                labels: {
                    align: 'left',
                    x: 9
                },
                title: {
                    text: 'level (metres)',
                    x: 0
                },
                lineWidth: 2,
                resize: {
                    enabled: false
                }
            },

            xAxis: {
                type: 'datetime'
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