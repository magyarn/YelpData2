
var width = 500,
    height = 500,
    radius = 300;

var formatNumber = d3.format(",d");

var x = d3.scale.linear()
    .range([0, 2 * Math.PI]);

var y = d3.scale.sqrt()
    .range([0, radius]);

var body = d3.select("body"),
    length = 400,
    color = d3.scale.linear().domain([1,length])
      .interpolate(d3.interpolateHcl)
      .range([d3.rgb("#000775"), d3.rgb('#00ACB8')]);


var partition = d3.layout.partition()
    .value(function(d) { return d.size; });

var arc = d3.svg.arc()
    .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
    .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
    .innerRadius(function(d) {
      if (d.depth < 3) {
      return radius * (d.y)*(d.y);
      }
      else if (d.depth === 3) {
        return radius * (d.y)*(d.y)
      }
    })
    .outerRadius(function(d) {
      if (d.depth < 3) {
      return radius * (d.y + d.dy)*(d.y + d.dy);
      }
    else if (d.depth === 3) {
      return radius * (d.y + (d.rating/50) + .01)*(d.y + (d.rating/50) - .02);
    }}
    );

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

var tags = document.getElementById("tags");


d3.json("js/AAflare.json", function(error, root) {
  if (error) throw error;

  let colorSwitch = 0;


  svg.selectAll("path")
      .data(partition.nodes(root))
    .enter().append("path")
      .attr("d", arc)
      .style("fill", function(d,i) {
      if (d.depth === 1){
        return "#2794E5"
      }
      else if (d.depth === 2){
        if (d.name === "$") {
          return "#31a354"
        }
        else if (d.name === "$$") {
          return "#78c769"
        }
        else if (d.name === "$$$") {
          return "#c2e699"
        }
        else if (d.name === "$$$$") {
          return "#f7fcb9"
        }
      }
      else if (d.depth === 3){
        return "#ff7f0f";
        // if (d.parent.name === "$") {
        //   return "#31a354"
        // }
        // else if (d.parent.name === "$$") {
        //   return "#78c769"
        // }
        // else if (d.parent.name === "$$$") {
        //   return "#c2e699"
        // }
        // else if (d.parent.name === "$$$$") {
        //   return "#f7fcb9"
        // }
      }

      }
    )
      .style("opacity", function(d) {
        if (d.depth === 3) {
          if (d.review_count < 25) {
            return .25;
          }
          else if (d.review_count >= 25 && d.review_count < 50) {
            return .5;
          }
          else if (d.review_count >= 50 && d.review_count < 75) {
            return .75;
          }
          else {
            return 1;
          }
        }
      })
      .style({"stroke": "black", "stroke-width": .5})
      .on("click", click)
      .on("mouseover", function(d) {
          var name = d.name
          tooltip.style("display", "block")
          if (d.depth === 2) {
            var cuisineTag = document.getElementById("cuisineTag");
            var priceTag = document.getElementById("priceTag");
            cuisineTag.innerHTML = `${d.parent.name} <p>${d.parent.averageRating} stars based on ${d.parent.numReviews} reviews</p>`;
            priceTag.innerHTML = d.name;
            cuisineTag.classList.add("burstTag");
            priceTag.classList.add("burstTag");
            tooltip.html(d.parent.name + ": " + name)

            if (d.name === "$") {
              priceTag.style.backgroundColor = "#31a354";
              priceTag.style.color = "#ffffff";
            }
            else if (d.name === "$$") {
              priceTag.style.backgroundColor = "#78c769";
              priceTag.style.color = "#ffffff";
            }
            else if (d.name === "$$$") {
              priceTag.style.backgroundColor = "#c2e699";
              priceTag.style.color = "#ffffff";
            }
            else if (d.name === "$$$$") {
              priceTag.style.backgroundColor = "#f7fcb9";
              priceTag.style.color = "#000000";
            }


          }
          else if (d.depth === 3){
            var cuisineTag = document.getElementById("cuisineTag");
            var priceTag = document.getElementById("priceTag");
            var restaurantTag = document.getElementById("restaurantTag");
            var ratingTag = document.getElementById("ratingTag");
            cuisineTag.innerHTML = `${d.parent.parent.name} <p>${d.parent.parent.averageRating} stars based on ${d.parent.parent.numReviews} reviews</p>`;
            priceTag.innerHTML = d.parent.name;
            restaurantTag.innerHTML = d.name;
            ratingTag.innerHTML = `${d.rating} stars based on ${d.review_count} reviews`;
            cuisineTag.className = "burstTag";
            priceTag.className = "burstTag";
            restaurantTag.className = "burstTag";
            ratingTag.className = "burstTag";
            tooltip.html(name + `<p>Rating: ${d.rating} stars</p>`)

            if (d.parent.name === "$") {
              priceTag.style.backgroundColor = "#31a354";
              restaurantTag.style.border = "1px solid black";
              ratingTag.style.backgroundColor = "#ff7f0f";
              priceTag.style.color = "#ffffff";
              restaurantTag.style.color = "#000000";
              restaurantTag.style.backgroundColor = "#ffffff";
              ratingTag.style.color = "#ffffff";
            }
            else if (d.parent.name === "$$") {
              priceTag.style.backgroundColor = "#78c769";
              restaurantTag.style.border = "1px solid black";
              ratingTag.style.backgroundColor = "#ff7f0f";
              priceTag.style.color = "#ffffff";
              restaurantTag.style.color = "#000000";
              restaurantTag.style.backgroundColor = "#ffffff";
              ratingTag.style.color = "#ffffff";
            }
            else if (d.parent.name === "$$$") {
              priceTag.style.backgroundColor = "#c2e699";
              restaurantTag.style.border = "1px solid black";
              ratingTag.style.backgroundColor = "#ff7f0f";
              priceTag.style.color = "#ffffff";
              restaurantTag.style.color = "#000000";
              restaurantTag.style.backgroundColor = "#ffffff";
              ratingTag.style.color = "#ffffff";
            }
            else if (d.parent.name === "$$$$") {
              priceTag.style.backgroundColor = "#f7fcb9";
              restaurantTag.style.border = "1px solid black";
              restaurantTag.style.backgroundColor = "#ffffff";
              ratingTag.style.backgroundColor = "#ff7f0f";
              priceTag.style.color = "#000000";
              restaurantTag.style.color = "#000000";
              ratingTag.style.color = "#000000";
            }

            if (d.review_count < 25) {
              ratingTag.style.backgroundColor = "rgba(255, 127, 15, .25)";
            }
            else if (d.review_count >= 25 && d.review_count < 50) {
              ratingTag.style.backgroundColor = "rgba(255, 127, 15, .5)";
            }
            else if (d.review_count >= 50 && d.review_count < 75) {
              ratingTag.style.backgroundColor = "rgba(255, 127, 15, .75)";
            }
            else {
              ratingTag.style.backgroundColor = "rgba(255, 127, 15, 1)";
            }


          }
          else if (d.depth === 1) {
            var cuisineTag = document.getElementById("cuisineTag");
            cuisineTag.innerHTML = `${d.name} <p>${d.averageRating} stars based on ${d.numReviews} reviews</p>`;
            cuisineTag.className = "burstTag";
            tooltip.html(name)

          }
          // tooltip.attr("class", "burstTooltip");
          // return tooltip.transition()
          //   .duration(50)
          //   .style("opacity", 0.9);


          // Fade all the segments.
          //
          // svg.selectAll("path")
          //     .style("opacity", 0.3);
          //
          // // Then highlight only those that are an ancestor of the current segment.
          // svg.selectAll("path")
          //     .filter(function(node) {
          //               return (node);
          //             })
          //     .style("opacity", 1);
        })
        .on("mousemove", function(d) {
          return tooltip
            .style("top", (d3.event.pageY-10)+"px")
            .style("left", (d3.event.pageX+10)+"px");
        })
        .on("mouseout", function(){
          var cuisineTag = document.getElementById("cuisineTag");
          var priceTag = document.getElementById("priceTag");
          var restaurantTag = document.getElementById("restaurantTag");
          cuisineTag.innerHTML = '';
          priceTag.innerHTML = '';
          restaurantTag.innerHTML = '';
          restaurantTag.style.border = '';
          ratingTag.innerHTML = '';
          cuisineTag.classList.remove("burstTag");
          priceTag.classList.remove("burstTag");
          restaurantTag.classList.remove("burstTag");
          ratingTag.classList.remove("burstTag");
          return tooltip.style("display", "none");
        });

        svg.append("circle")
          .attr("cx", 0)
          .attr("cy", 0)
          .attr("r", 175)
          .style("fill", "none")
          .style({"stroke": "black", "stroke-width": .5})
          .style("opacity", .5);

        svg.append("circle")
          .attr("cx", 0)
          .attr("cy", 0)
          .attr("r", 185)
          .style("fill", "none")
          .style({"stroke": "black", "stroke-width": .5})
          .style("opacity", .5);

        svg.append("circle")
          .attr("cx", 0)
          .attr("cy", 0)
          .attr("r", 195)
          .style("fill", "none")
          .style({"stroke": "black", "stroke-width": .5})
          .style("opacity", .5);

        svg.append("circle")
          .attr("cx", 0)
          .attr("cy", 0)
          .attr("r", 205)
          .style("fill", "none")
          .style({"stroke": "black", "stroke-width": .5})
          .style("opacity", .5);

          svg.append("circle")
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", 215)
            .style("fill", "none")
            .style({"stroke": "black", "stroke-width": .5})
            .style("opacity", .5);

});



function click(d) {
  console.log(d);
  // if (d.depth === 1) {
  //   const cuisineTag = document.getElementById("selectedCuisine").innerHTML = "Cuisine: " + d.name;
  // }
  // else if (d.depth === 2) {
  //   const cuisineTag = document.getElementById("selectedCuisine").innerHTML = "Cuisine: " + d.parent.name;
  //   document.getElementById("selectedPrice").innerHTML = "Price Range: " + d.name;
  // }
  // else if (d.depth === 3) {
  //   const cuisineTag = document.getElementById("selectedCuisine").innerHTML = "Cuisine: " + d.parent.parent.name;
  //   document.getElementById("selectedPrice").innerHTML = "Price Range: " + d.parent.name;
  // }
  // else if (d.depth === 0) {
  //   document.getElementById("selectedCuisine").innerHTML = "Cuisine: <em>Not selected</em>";
  //   document.getElementById("selectedPrice").innerHTML = "Price Range: <em>Not selected</em>";
  // }
  // else if (d.parent.depth === 0) {
  //   document.getElementById("selectedPrice").innerHTML = "Price Range: <em>Not selected</em>";
  // }
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
