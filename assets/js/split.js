var Highcharts;
var optionSelected;
var dropdown = $('#option_selector');
var url = '../warehouse/measures/menu/menu.json';


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
function generateChart(fileNameKey){

    $.getJSON('../warehouse/measures/points/split/' + fileNameKey + '.json', function (source)  {


        // split the data set into ...
        let sectors = [],
            groupingUnits = [[
                'hour',                         // unit name
                [1]                            // allowed multiples
            ]];

        for (var i = 0; i < source.data.length; i += 1) {

            sectors.push({
                name: source['periods'][i].substring(0, 4),
                data: source.data[i],
                type: 'spline',
                dataGrouping: {
                    enabled: true,
                    units: groupingUnits,
                    dateTimeLabelFormats: {
                        millisecond: ['%e %b, %H:%M:%S.%L', '%A, %b %e, %H:%M:%S.%L', '-%H:%M:%S.%L'],
                        second: ['%e %b, %H:%M:%S', '%A, %b %e, %H:%M:%S', '-%H:%M:%S'],
                        minute: ['%e %b, %H:%M', '%A, %b %e, %H:%M', '-%H:%M'],
                        hour: ['%e %b, %H:%M', '%A, %b %e, %H:%M', '-%H:%M'],
                        day: ['%e %b, %Y', '%A, %b %e', '-%A, %b %e, %Y'],
                        week: ['Week from %A, %e %b, %Y', '%A, %b %e', '-%A, %b %e, %Y'],
                        month: ['%B %Y', '%B', '-%B %Y'],
                        year: ['%Y', '%Y', '-%Y']
                    }
                },
                tooltip: {
                    pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {series.name} </b>: ' +
                        '{point.y:,.3f}m<br/>'
                },
                visible: i > 3

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
                selected: 5,
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
                text: optionSelected
            },

            subtitle: {
                text: 'Gauge River/Water Spot: ' + source['attributes']['river_name']
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
                },
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
                    enabled: true
                }
            },

            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: {
                    month: '%e. %b',
                    year: '%b'
                },
                title: {
                    text: 'Date'
                }
            },

            caption: {
                text: '<p>Each spline represents a gauge\'s river level measures ' +
                    'during a single year.</p>'
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
                split: true
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