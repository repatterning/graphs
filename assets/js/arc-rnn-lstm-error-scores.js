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

    $.getJSON(endpoint + '/aggregates.json', function (data) {

        // https://api.highcharts.com/highstock/plotOptions.series.dataLabels
        // https://api.highcharts.com/class-reference/Highcharts.Point#.name
        // https://api.highcharts.com/highstock/tooltip.pointFormat

        let source = data[fileNameKey];

        var __training = [],
            __testing = [];

        // per catchment
        for (let i = 0; i < source.length; i += 1) {


            // splits
            var training = [],
                testing = [];


            // training metrics: per gauge station
            let ctr = source[i]['training']['columns'];
            let tr_sn = ctr.indexOf('station_name'),
                tr_mpe = ctr.indexOf('median_pe'),
                tr_r_mse = ctr.indexOf('r_median_se');

            for (let j = 0; j < source[i]['data'].length; j += 1) {
                training.push({
                    x: source[i]['data'][j][tr_mpe], // median percentage error
                    y: source[i]['data'][j][tr_r_mse], // root median square error
                    name: source[i]['data'][j][tr_sn] + '<br/>', // station name / catchment name
                    description:  Highcharts.numberFormat(source[i]['data'][j][tr_mpe], 4) + '<br/>' +
                        '<b>root median square error:</b> ' + Highcharts.numberFormat(source[i]['data'][j][tr_r_mse], 4) + '<br/>'
                });
            }

            __training.push({
                type: 'scatter',
                name: source[i]['catchment_name'],
                data: training,
                className: source[i]['catchment_name'], // for point classification by catchment
                tooltip: {
                    pointFormat: '<br/>' +
                        '<b>gauge station:</b> {point.name}<br/>' +
                        '<b>catchment:</b> {series.name}' +
                        '<b>median percentage error:</b> {point.description}'

                }
            });


            // testing metrics: per gauge station
            let cte = source[i]['testing']['columns'];
            let te_sn = cte.indexOf('station_name'),
                te_mpe = cte.indexOf('median_pe'),
                te_r_mse = cte.indexOf('r_median_se');

            for (let j = 0; j < source[i]['data'].length; j += 1) {
                testing.push({
                    x: source[i]['data'][j][te_mpe], // median percentage error
                    y: source[i]['data'][j][te_r_mse], // root median square error
                    name: source[i]['data'][j][te_sn] + '<br/>', // station name / catchment name
                    description:  Highcharts.numberFormat(source[i]['data'][j][te_mpe], 4) + '<br/>' +
                        '<b>root median square error:</b> ' + Highcharts.numberFormat(source[i]['data'][j][te_r_mse], 4) + '<br/>'
                });
            }

            __testing.push({
                type: 'scatter',
                name: source[i]['catchment_name'],
                data: testing,
                className: source[i]['catchment_name'], // for point classification by catchment
                tooltip: {
                    pointFormat: '<br/>' +
                        '<b>gauge station:</b> {point.name}<br/>' +
                        '<b>catchment:</b> {series.name}' +
                        '<b>median percentage error:</b> {point.description}'

                }
            });

        }


        // formatting: numbers
        Highcharts.setOptions({
            lang: {
                thousandsSep: ','
            }
        });



    }).fail(function () {
        console.log("Missing");
        $('#container0002').empty();
    });

}
