
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
    .size(4)
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

var tooltip = d3.select("body")
   .append("div")
   .attr("class", "tooltip")
   .style("position", "absolute")
   .style("z-index", "10")
   .style("opacity", 0);


d3.json("js/AAflare.json", function(error, root) {
  if (error) throw error;

  let colorSwitch = 0;

  svg.selectAll("path")
      .data(partition.nodes(root))
    .enter().append("path")
      .attr("d", arc)
      .style("fill", function(d,i) {
        console.log(d);
        return color(i)
    //     if(d.depth==3){
    //     return color(10);
    //   }
    //   else if(d.depth==2){
    //   return color(4);
    // }
    //   else if (d.depth === 1){
    //     if (colorSwitch === 0) {
    //       colorSwitch = 1;
    //       return "#000000";
    //     }
    //     else {
    //       colorSwitch = 0;
    //       return "#92278f";
    //     }
    //   }
    })
      .style({"stroke": "black", "stroke-width": .5})
      .on("click", click)
      .on("mouseover", function(d) {
          var name = d.name
          tooltip.style("display", "block")
          if (d.depth === 2) {
            tooltip.html(d.parent.name + ": " + name)
          }
          else if (d.depth === 3){
            tooltip.html(name + `<p>Rating: ${d.rating}</p><p>${d.parent.parent.name}: ${d.parent.name}</p>`)
          }
          else {
            tooltip.html(name)
          }
          tooltip.attr("class", "burstTooltip");
          return tooltip.transition()
            .duration(50)
            .style("opacity", 0.9);
        })
        .on("mousemove", function(d) {
          return tooltip
            .style("top", (d3.event.pageY-10)+"px")
            .style("left", (d3.event.pageX+10)+"px");
        })
        .on("mouseout", function(){return tooltip.style("display", "none");});
});



function click(d) {
  console.log(d);
  if (d.depth === 1) {
    const cuisineTag = document.getElementById("selectedCuisine").innerHTML = "Cuisine: " + d.name;
  }
  else if (d.depth === 2) {
    const cuisineTag = document.getElementById("selectedCuisine").innerHTML = "Cuisine: " + d.parent.name;
    document.getElementById("selectedPrice").innerHTML = "Price Range: " + d.name;
  }
  else if (d.depth === 3) {
    const cuisineTag = document.getElementById("selectedCuisine").innerHTML = "Cuisine: " + d.parent.parent.name;
    document.getElementById("selectedPrice").innerHTML = "Price Range: " + d.parent.name;
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
