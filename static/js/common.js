let global_data = {};
let k_multiply = 1000;

function get_data() {
  $.get("./data")
    .done(function (data) {
      _.assign(global_data, prepare_data(perform_typeCast(JSON.parse(data))));
      _.assign(global_data.filters, {
        current_year_selected: global_data.filters.years[0],
      });
      _.map(global_data.filters.years, (d) => {
        $("#year_select").append(
          $("<option></option>").attr("value", d).text(d)
        );
      });
      render_area_chart(global_data.trend_data);
      render_page();
    })
    .fail(function () {});
}

function perform_typeCast(data) {
  _.map(data, (d) => {
    d["year"] = parseInt(d["year"]);
    d["population"] = numeral(d["population"]).value() * k_multiply; //population_growth_rate
    d["population_density"] = parseInt(d["population_density"]);
    d["population_growth_rate"] = parseFloat(d["population_growth_rate"]);
  });
  return data;
}

function prepare_data(data) {
  let results = {};
  let years = { years: Object.keys(_.groupBy(data, "year")).sort().reverse() };
  let trend_data = [];
  _.map(_.groupBy(data, "year"), (v, k) => {
    trend_data.push({
      x: k,
      y: _.sumBy(v, "population"),
      tooltip: `Year: ${k} </br> Population: ${numeral(_.sumBy(v, "population"))
        .format("0,0.00 a")
        .toUpperCase()
        .replace("M", "Mn")
        .replace("B", "Bn")}`,
    });
  });
  _.assign(results, { filters: years });
  _.assign(results, { yearly_data: _.groupBy(data, "year") });
  _.assign(results, { trend_data: trend_data });
  return results;
}

function render_total_population_section(data, year_selected) {
  let total_population = _.sumBy(data, "population");
  $(".total_population").html(
    numeral(total_population)
      .format("0,0.00 a")
      .toUpperCase()
      .replace("M", "Mn")
      .replace("B", "Bn")
  );
  $(".year_selected").html(`(${year_selected})`);
}

function render_area_chart(data) {
  draw_area_chart("#trend-line-chart", { data: data });
}
function render_scatterplot(data, current_year_selected) {
  let current_population = _.sumBy(data, "population");
  let avg_density = _.meanBy(data, "population_density");
  let prev_population = _.sumBy(
    global_data.yearly_data[parseInt(current_year_selected) - 1],
    "population"
  );
  let avg_growth =
    ((current_population - prev_population) * 100) / prev_population;
  let scatter_data = [];
  _.map(
    _.filter(data, (d) => {
      return !isNaN(d["population_growth_rate"]);
    }),
    (d) => {
      scatter_data.push({
        x: d["population_density"],
        y: d["population_growth_rate"],
        r: d["population"],
        continent: d["continent"],
        tooltip: `Country: ${d["country"]} </br> Continent: ${
          d["continent"] == null ? "" : d["continent"]
        } </br> Population: ${numeral(d["population"])
          .format("0,0.00 a")
          .toUpperCase()
          .replace("M", "Mn")
          .replace("B", "Bn")}`,
      });
    }
  );
  let config = {};
  (config["data"] = scatter_data),
    (config["avg_density"] = avg_density),
    (config["avg_growth"] = avg_growth),
    draw_scatter_plot("#scatter-plot", config);
}

function render_page() {
  let current_year_data =
    global_data.yearly_data[global_data.filters.current_year_selected];
  render_total_population_section(
    current_year_data,
    global_data.filters.current_year_selected
  );
  render_scatterplot(
    current_year_data,
    global_data.filters.current_year_selected
  );
}

$(document)
  .ready(function () {
    get_data();
  })
  .on("change", "#year_select", function () {
    global_data.filters.current_year_selected = this.value;
    render_page();
  });
