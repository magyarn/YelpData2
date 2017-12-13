$.getJSON("js/AArestaurants.json", function(data) {

  var sortedRestaurants = data.businesses.sort((a,b) => b.rating - a.rating);
  let restaurantNames = (sortedRestaurants.map(d => d.name)).slice(1,15);
  let restaurantRatings = (sortedRestaurants.map(d => d.rating)).slice(1,15);
  let cuisines = [];

  data.businesses.forEach(function(d){
    if (d.categories) {
      d.categories.forEach(function(c){
        if (!cuisines.includes(c.title)) {
          cuisines.push(c.title);
        }
      })
    }
  })

  const sortedCuisines = cuisines.sort();
  const cuisineFilter = document.getElementById("cuisines");

  sortedCuisines.forEach(function(c) {
    const newC = document.createElement("option");
    newC.innerHTML = "<option value=" + c + ">"+ c + "</option>";
    cuisineFilter.appendChild(newC);
  })

  var chart = c3.generate({
    bindto: '#chart',
    data: {
        json: {
            'Ratings': restaurantRatings
        },
        type:'bar',
        colors: {
          Ratings: 'rgb(0,109,44);',
      },
    },
    bar: {
        width: {
            ratio: 0.5
    }},
      axis: {
        x: {
          type: 'category',
          categories: restaurantNames,
          tick: {
            rotate: 45,
            multiline: false
          }
        }
      },
      tooltip: {
      format: {
          title: function (d) {
            var cuisineTooltipData = [];
              sortedRestaurants[d].categories.forEach(function(element){
                //console.log(element.title);
                cuisineTooltipData.push(element.title);
            });
            return 'Cuisines: '+cuisineTooltipData;
          }
        }

      },
      legend: {
      show: false
  }
  });

  for(let i=0;i<15;i++)
  {
    //console.log(sortedRestaurants[i].price);

    if(sortedRestaurants[i].price=='$')
    {
      d3.select(".c3-bar-"+i).style("fill", "rgb(44,162,95)");
    }
    else if(sortedRestaurants[i].price=='$$')
    {
      d3.select(".c3-bar-"+i).style("fill", "rgb(102,194,164)");
    }
    else if(sortedRestaurants[i].price=='$$$')
    {
      d3.select(".c3-bar-"+i).style("fill", "rgb(178,226,226)");
    }
    else
    {
      d3.select(".c3-bar-"+i).style("fill", "rgb(237, 248, 251)");
    }

  }

  cuisineFilter.onchange = function(e) {
    //console.log(e.target.value);
    let selectedCuisine = e.target.value;
    let filteredRestaurants = [];
    sortedRestaurants.forEach(function(element){
        element.categories.forEach(function(element2)
        {
            if(element2.title==selectedCuisine){
              filteredRestaurants.push(element);
            }
        });
    });



   var top15filteredRestaurants = filteredRestaurants.slice(0,15);
   var filteredRestaurantNames = top15filteredRestaurants.map(d => d.name);
   var filteredrestaurantRatings = top15filteredRestaurants.map(d => d.rating);


    var chart = c3.generate({
      bindto: '#chart',
      data: {
          json: {
              'Ratings': filteredrestaurantRatings
          },
          type:'bar',
          colors: {
            Ratings: '#edf8fb',
        },
      },
        bar: {
            width: {
                ratio: 0.5
        }},
        axis: {
          x: {
            type: 'category',
            categories: filteredRestaurantNames,
                tick: {
                  rotate: 45,
                  multiline: false
                }
          }
        },
        tooltip: {
        format: {
            title: function (d) {
              var cuisineTooltipData = [];
                top15filteredRestaurants[d].categories.forEach(function(element){
                  //console.log(element.title);
                  cuisineTooltipData.push(element.title);
              });
              return 'Cuisines: '+cuisineTooltipData;
            }
          }

        },
        legend: {
        show: false
    }
});

    for(let i=0;i<top15filteredRestaurants.length;i++)
    {
      //console.log(top15filteredRestaurants[i].price);

      if(top15filteredRestaurants[i].price=='$')
      {
        d3.select(".c3-bar-"+i).style("fill", "rgb(44,162,95)");
      }
      else if(top15filteredRestaurants[i].price=='$$')
      {
        d3.select(".c3-bar-"+i).style("fill", "rgb(102,194,164)");
      }
      else if(top15filteredRestaurants[i].price=='$$$')
      {
        d3.select(".c3-bar-"+i).style("fill", "rgb(178,226,226)");
      }
      else
      {
        d3.select(".c3-bar-"+i).style("fill", "rgb(237, 248, 251)");
      }

    }

    var avg = 0.0;
    filteredRestaurants.forEach(function(element)
    {
       avg += element.rating;
    })

    avg = avg/filteredRestaurants.length;
    console.log(avg);

    var axisData = (d3.select(".c3-axis-y"))[0][0].childNodes;
    //var gAxis = axisData.selectAll('g')
    //axisData.childNodes[1].childNodes[1].childNodes[0].innerHTML
    for (var i=1;i<axisData.length-1;i++)
    {

      if(axisData[i].childNodes[1].childNodes[0].innerHTML-avg == 0){
        var y_coord = axisData[i].getAttribute("transform").split(",")[1].split(')')[0];
        var ycoord = parseInt(y_coord)+4;
        //d3.select('svg').append("line").attr({ x1: 0, y1: y_coord, x2: 0, y2: y_coord+50});
        d3.select('svg')
        .append("line")
        .attr({ x1: 40, y1: ycoord, x2: 1000, y2: ycoord})
        .attr('class','dashed');

        d3.select('svg')
        .append("text")
        .attr("x",200)
        .attr("y",ycoord-5)
        .text("Average rating");
      }

    if(axisData[i].childNodes[1].childNodes[0].innerHTML-avg < 0.5 &&
      axisData[i].childNodes[1].childNodes[0].innerHTML-avg > 0)
      {
        var y_coordupper = axisData[i].getAttribute("transform").split(",")[1].split(')')[0];
        var ycoord = y_coordupper;
        var y_coordlower = axisData[i-1].getAttribute("transform").split(",")[1].split(')')[0];
        var y_coord = (y_coordlower-y_coordupper);
        ycoord = parseInt(ycoord) + ((y_coord/0.5)*0.4);

        var finalPoint = document.getElementsByTagName('svg')[0].getAttribute('width');
        console.log(finalPoint);
        d3.select('svg')
        .append("line")
        .attr({ x1: 40, y1: ycoord, x2: finalPoint, y2: ycoord})
        .attr('class','dashed');

        d3.select('svg')
        .append("text")
        .attr("x",200)
        .attr("y",ycoord-5)
        .text("Average rating");
      }
    }

  };


});
