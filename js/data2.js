var width = 500,
    height = 500,
    radius = (Math.min(width, height) / 2) - 10;

var formatNumber = d3.format(",d");

var x = d3.scale.linear()
    .range([0, 2 * Math.PI]);

var y = d3.scale.sqrt()
    .range([0, radius]);

var body = d3.select("body"),
    length = 800,
    color = d3.scale.linear().domain([1,length])
      .interpolate(d3.interpolateHcl)
      .range([d3.rgb("#000775"), d3.rgb('#00ACB8')]);


var partition = d3.layout.partition()
    .value(function(d) { return d.size; });

var arc = d3.svg.arc()
    .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
    .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
    .innerRadius(function(d) { return Math.max(0, y(d.y)); })
    .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });

var svg = d3.select("#sunburst").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + (height / 2) + ")");

d3.json("js/AAflare.json", function(error, root) {
  if (error) throw error;

  svg.selectAll("path")
      .data(partition.nodes(root))
    .enter().append("path")
      .attr("d", arc)
      .style("fill", function(d,i) { return color(i); })
      .style({"stroke": "black", "stroke-width": .5})
      .on("click", click)
    .append("title")
      .text(function(d) { return d.children ? d.name + "\n" + formatNumber(d.value) : d.name});
});



function click(d) {
  console.log(d);
  if (d.depth === 1) {
    document.getElementById("selectedCuisine").innerHTML = "Cuisine: " + d.name;
  }
  else if (d.depth === 2) {
    document.getElementById("selectedCuisine").innerHTML = "Cuisine: " + d.parent.name;
    document.getElementById("selectedPrice").innerHTML = "Price Range: " + d.name;
  }
  else if (d.depth === 0) {
    document.getElementById("selectedCuisine").innerHTML = "Cuisine: <em>Not selected</em>";
    document.getElementById("selectedPrice").innerHTML = "Price Range: <em>Not selected</em>";
  }
  else if (d.parent.depth === 0) {
    document.getElementById("selectedPrice").innerHTML = "Price Range: <em>Not selected</em>";
  }
  svg.transition()
      .duration(750)
      .tween("scale", function() {
        var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
            yd = d3.interpolate(y.domain(), [d.y, 1]),
            yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
        return function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); };
      })
    .selectAll("path")
      .attrTween("d", function(d) { return function() { return arc(d); }; })
      
}

d3.select(self.frameElement).style("height", height + "px");