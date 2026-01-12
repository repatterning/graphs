// noinspection DuplicatedCode

var Highcharts;
var optionSelected;
var dropdown = $('#option_selector');
var url = '../warehouse/risks/menu/menu.json';


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

    // $('#option_selector_title').remove();

    // Save name and value of the selected option
    optionSelected = this.options[e.target.selectedIndex].text;
    var valueSelected = this.options[e.target.selectedIndex].value;

    //Draw the Chart
    generateChart(valueSelected);
});


// Generate graphs
function generateChart(fileNameKey) {

    $.getJSON('../warehouse/risks/points/' + fileNameKey + '.json', function (source) {

        // https://api.highcharts.com/highstock/plotOptions.series.dataLabels
        // https://api.highcharts.com/class-reference/Highcharts.Point#.name
        // https://api.highcharts.com/highstock/tooltip.pointFormat


        // The fields
        const columns = {
            station: [],
            latest: [],
            maximum: [],
            catchment: [],
            satellite: []
        };


        // Data
        for (let i = 0; i < source.length; i += 1) {

            let indices = source[i]['columns'];
            let i_latest = indices.indexOf('latest'),
                i_maximum = indices.indexOf('maximum'),
                i_station = indices.indexOf('station_name'),
                i_latitude = indices.indexOf('latitude'),
                i_longitude = indices.indexOf('longitude');

            for (let j = 0; j < source[i]['data'].length; j += 1) {

                if (source[i]['data'][j][i_latest] >= 0) {
                    continue;
                }

                let latitude = source[i]['data'][j][i_latitude],
                    longitude = source[i]['data'][j][i_longitude],
                    name = source[i]['data'][j][i_station];

                // Street Images
                let point = `<a href='https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}&zoom=12#map=16/${latitude}/${longitude}' class='btn btn-sm btn-outline-primary' onClick="window.open('https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}&zoom=12#map=16/${latitude}/${longitude}', '_blank', 'popup=true,rel=noreferrer'); return false;" target="_blank">${name}</a>`;
                columns.station.push(point);

                // Satellite Images
                let image = `<a href="https://firms.modaps.eosdis.nasa.gov/map/#t:tsd;d:today;l:fires_all,earth;@${longitude},${latitude},16.000z" target="_blank"><img src="../assets/img/favicon/satellite.svg" height="15px" width="15px" alt="image" /></a>`;
                columns.satellite.push(image);

                columns.latest.push(Highcharts.numberFormat(source[i]['data'][j][i_latest], 4));
                columns.maximum.push(Highcharts.numberFormat(source[i]['data'][j][i_maximum], 4))
                columns.catchment.push(source[i]['catchment_name']);

            }

        }


        // Grid
        Grid.grid('container0003', {

            dataTable: {
                columns: columns
            },

            lang: {
                pagination: {
                    pageInfo: `{start} - {end} of {total}
                (page {currentPage} of {totalPages})`,
                    rowsPerPage: 'rows per page'
                }
            },

            credits: {
                enabled: false
            },

            rendering: {
                rows: {
                    minVisibleRows: 10
                }
            },

            pagination: {
                enabled: true,
                pageSize: 10,
                controls: {
                    pageSizeSelector: {
                        enabled: true,
                        options: [10, 20, 50]
                    },
                    pageInfo: true,
                    firstLastButtons: true,
                    previousNextButtons: true,
                    pageButtons: {
                        enabled: true,
                        count: 7
                    }
                }
            },

            // https://api.highcharts.com/grid/#interfaces/Grid_Core_Options.Options#columndefaults
            columnDefaults: {
                sorting: {
                    sortable: true
                }
            },

            // https://api.highcharts.com/grid/#interfaces/Grid_Core_Options.Options#columns
            columns: [{
                id: 'latest',
                width: 125,
                header: {
                    format: '<b>Latest</b><br>(mm/hr)'
                },
                sorting: {
                    enabled: true,
                    order: 'desc'
                }
            }, {
                id: 'maximum',
                width: 125,
                header: {
                    format: '<b><abbr title="During the last 9 days, approximately.  Read the graph notes.">Maximum</abbr></b><br>(mm/hr)'
                }
            },{
                id: 'catchment',
                width: 205,
                header: {
                    format: '<b>Catchment</b>'
                },
                filtering: {
                    enabled: true,
                    inline: false,
                    condition: 'contains'
                }
            }, {
                id: 'station',
                width: 165,
                header: {
                    format: '<b>Station</b>'
                },
                filtering: {
                    enabled: true,
                    inline: false,
                    condition: 'contains'
                }
            }, {
                id: 'satellite',
                width: 100,
                header: {
                    format: ' '
                },
                sorting: {
                    enabled: false
                }
            }]

        });

    }).fail(function () {
        console.log("Missing");
        $('#container0003').empty();
    });

}
