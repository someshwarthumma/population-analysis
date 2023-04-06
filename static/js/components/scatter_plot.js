function draw_scatter_plot(selector, config) {
    var data = config.data
    // set the dimensions and margins of the graph
    var margin = { top: 30, right: 20, bottom: 50, left: 20 },
        width = $(selector).width() - margin.left - margin.right,
        height = $(selector).height() - margin.top - margin.bottom;
    // append the svg object to the body of the page
    d3.select(selector).selectAll("*").remove();
    var svg = d3.select(selector)
        .append("svg")
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
        // .attr("width", width + margin.left + margin.right)
        // .attr("height", height + margin.top + margin.bottom)
        .attr("class", "border-0")
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Add X axis
    var x = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) { return +d.x; })])
        .range([0, width]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickFormat(d => { return numeral(d).format('0,0') }));

    // Add Y axis
    // var y = d3.scaleLinear()
    //     .domain([d3.min(data, function (d) { return +d.y; }), d3.max(data, function (d) { return +d.y; })])
    //     .range([height, 0]);
    var y = d3.scaleLinear()
        .domain([-1, 4])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y).ticks(3).tickValues([-1, 0, 4]));

    var r = d3.scaleLinear()
        .domain([d3.min(data, function (d) { return +d.r; }), d3.max(data, function (d) { return +d.r; })])
        .range([2, 20]);
    var color_scale = d3.scaleOrdinal()
        .domain([...Object.keys(_.groupBy(_.filter(data,d=>{return d['continent'] != null}),'continent'))])
        .range(["#4e79a7","#f28e2c","#e15759","#76b7b2","#59a14f","#edc949","#af7aa1"])

    // -1- Create a tooltip div that is hidden by default:
    const tooltip1 = d3
        .select(selector)
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip1")
        .style("background-color", "black")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("color", "white");

    // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
    // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
    var showTooltip = function (event) {
        let tooltip_text = event.tooltip;
        tooltip1.html(tooltip_text).style("opacity", 1);
    };
    var moveTooltip = function () {
        tooltip1
            .style("left", d3.mouse(this)[0] + 0 + "px")
            .style("top", d3.mouse(this)[1] + 220 + "px");
    };
    var hideTooltip = function () {
        tooltip1.style("opacity", 0);
    };

    // Add the area
    svg.append('g')
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "dots")
        .attr("continent", function (d) { return d.continent; })
        .attr("cx", function (d) { return x(d.x); })
        .attr("cy", function (d) { return y(d.y); })
        .attr("r", function (d) { return r(d.r); })
        .style("fill", function (d) { return d.continent != null ? color_scale(d.continent): "red"})
        .on("mouseover", showTooltip)
        .on("mousemove", moveTooltip)
        .on("mouseleave", hideTooltip);
    

}