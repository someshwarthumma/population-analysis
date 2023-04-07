function draw_area_chart(selector, config) {
  var data = config.data;
  // set the dimensions and margins of the graph
  var margin = { top: 40, right: 30, bottom: 30, left: 50 },
    width = $(selector).width() - margin.left - margin.right,
    height = $(selector).height() - margin.top - margin.bottom;
  // append the svg object to the body of the page
  d3.select(selector).selectAll("*").remove();
  var svg = d3
    .select(selector)
    .append("svg")
    .attr('class','border-0')
    .attr(
      "viewBox",
      `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom
      }`
    )
    // .attr("width", width + margin.left + margin.right)
    // .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Add X axis --> it is a date format
  _.map(data, (d) => {
    (d.date = d3.timeParse("%Y-%m-%d")(`${d.x}-06-15`)), (d.value = d.y);
  });
  var x = d3
    .scaleTime()
    .domain(
      d3.extent(data, function (d) {
        return d.date;
      })
    )
    .range([0, width]);

  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .attr('class', 'bottom-axis')
    .call(d3.axisBottom(x).tickSizeOuter(0)
      .tickFormat(d3.timeFormat("%Y")).tickValues([data[0].date, data[data.length - 1].date]))

  // Add Y axis
  var y = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(data, function (d) {
        return +d.value;
      }),
    ])
    .range([height, 0]);

  // Add the area
  svg
    .append("path")
    .datum(data)
    .attr("fill", "#f28e2c")
    .attr("opacity", "0.3")
    .attr("stroke-width", 1.5)
    .attr(
      "d",
      d3
        .area()
        .x(function (d) {
          return x(d.date);
        })
        .y0(y(0))
        .y1(function (d) {
          return y(d.value);
        })
    );

  svg
    .append("path")
    .datum(data)
    .attr("stroke-width", 1.5)
    .attr("fill", "none")
    .attr("stroke", "#fcb788")
    .attr(
      "d",
      d3
        .line()
        .x(function (d) {
          return x(d.date);
        })
        .y(function (d) {
          return y(d.value);
        })
    );
  svg.selectAll('text').append('text')
    .data(data)
    .enter()
    .append('text')
    .attr('x', d => { return x(d.date) })
    .attr('y', d => { return y(d.value) - 12 })
    .attr('fill', 'grey')
    .style("font-size", "0.7rem")
    .style("text-anchor", "middle")
    .attr('opacity', (_d, i) => { return (i == 2 || i == (data.length - 1)) ? '1' : '0' })
    .text(d => {
      return numeral(d.value
      )
        .format("0,0.00 a")
        .toUpperCase()
        .replace("M", "Mn")
        .replace("B", "Bn")
    })
}
