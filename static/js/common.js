let global_data = {}

function get_data() {
    $.get('./data').done(function(data){
        _.assign(global_data, prepare_data(perform_typeCast(JSON.parse(data))))
        render_page()
    }).fail(function() {
        
    })
}

function perform_typeCast(data){
    _.map(data, d=>{
        d['year'] = parseInt(d['year'])
        d['population'] = numeral(d['population']).value() //population_growth_rate
        d['population_density'] = parseInt(d['population_density']) 
        d['population_growth_rate'] = parseFloat(d['population_growth_rate']) 
    })
    return data
}

function prepare_data(data) {
    let results = {}
    let years =  {'years':Object.keys(_.groupBy(data,'year')).sort().reverse()}
    _.assign(results, {'filters':years})


    return results 
}

function render_page() {
    _.map(global_data.filters.years, d=>{
        $('#year_select').append($("<option></option>").attr("value",d).text(d))
    })    
}

$(document).ready(function () {
    get_data()
  });