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

    $('#option_selector_title').remove();

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

        const columns = {
            station: [],
            latest: [],
            catchment: [],
            coordinates: []
        };

        for (let i = 0; i < source.length; i += 1) {

            let indices = source[i]['columns'];
            let i_latest = indices.indexOf('latest'),
                i_station = indices.indexOf('station_name'),
                i_latitude = indices.indexOf('latitude'),
                i_longitude = indices.indexOf('longitude');

            for (let j = 0; j < source[i]['data'].length; j += 1) {

                if (source[i]['data'][j][i_latest] < 0) {
                    continue;
                }

                columns.station.push(source[i]['data'][j][i_station]);
                columns.latest.push(Highcharts.numberFormat(source[i]['data'][j][i_latest], 4));
                columns.catchment.push(source[i]['catchment_name']);

                let point = [source[i]['data'][j][i_latitude], source[i]['data'][j][i_longitude]];
                columns.coordinates.push(point);

            }



        }


    }).fail(function () {
        console.log("Missing");
        $('#container0002').empty();
    });

}
