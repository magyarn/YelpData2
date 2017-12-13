d3.json("/js/AArestaurants.json", function(data) {
  // console.log(data.businesses);
  let cuisineCount = {}; //Stores keys of cuisine types and number of each in dataset
  let cuisineRatings = {}; //Stores cuisine types and array of all ratings for each
  let averageRatings = {}; //Stores cuisine types and average rating for that type

  let zipCodeCount = {}; //Stores all zipcodes and how many restaurants share that zipcode
  let zipRatings = {}; //Stores average ratings associated with each zipcode

  let priceCount = {}; //Stores all prices found in dataset and how many restaurants fall at that price
  let priceRatings = {}; //Stores average rating for each price level

  // console.log(data[0]);

  data.businesses.forEach(function(d) {

    //For each restaurant, get it's cuisine type, rating, zipcode and price
    const cuisine = d["categories"][0]["title"];
    const rating = Number(d["rating"]);
    const zip = d["location"]["zip_code"];
    const price = d["price"];

    //Populated the empty objects created above
    if (cuisineCount.hasOwnProperty(cuisine)) {
    cuisineCount[cuisine]++
    }
    else {
      cuisineCount[cuisine] = 1;
    }

    if (cuisineRatings.hasOwnProperty(cuisine)) {
    cuisineRatings[cuisine].push(rating);
    }
    else {
      cuisineRatings[cuisine] = [rating];
    }

    if (zipCodeCount.hasOwnProperty(zip)) {
    zipCodeCount[zip]++
    }
    else {
      zipCodeCount[zip] = 1;
    }

    if (zipRatings.hasOwnProperty(zip)) {
    zipRatings[zip].push(rating);
    }
    else {
      zipRatings[zip] = [rating];
    }

    if (priceCount.hasOwnProperty(price)) {
      priceCount[price]++
    }
    else {
      priceCount[price] = 1;
    }

    if (priceRatings.hasOwnProperty(price)) {
  priceRatings[price].push(rating);
    }
    else {
      priceRatings[price] = [rating];
    }
  });




  //Creating the average ratings for the above objects
  for (let c in cuisineRatings) {
    const aveRating = cuisineRatings[c].reduce( (a,b) => a+ b, 0) / cuisineRatings[c].length;
    averageRatings[c] = aveRating;
  }
  console.log("Number of Restaurants by Cuisine Type: ", cuisineCount);
  console.log("Ratings by Cuisine: ", averageRatings);

  for (let z in zipRatings) {
    const aveRating = zipRatings[z].reduce( (a,b) => a+ b, 0) / zipRatings[z].length;
    zipRatings[z] = aveRating;
  }
  console.log("Number of Restaurants by Zipcode: ", zipCodeCount);
  console.log("Ratings by Zipcode: ", zipRatings);

  for (let p in priceRatings) {
    const aveRating = priceRatings[p].reduce( (a,b) => a+ b, 0) / priceRatings[p].length;
    priceRatings[p] = aveRating;
  }
  console.log("Number of Restaurants by Price: ", priceCount);
  console.log("Ratings by Price: ", priceRatings);

  //Create "Top 10" Lists
  function sortProperties(obj) {
    // convert object into array
  	var sortable=[];
  	for(var key in obj)
  		if(obj.hasOwnProperty(key))
  			sortable.push([key, obj[key]]); // each item is an array in format [key, value]

  	// sort items by value
  	sortable.sort(function(a, b)
  	{
  	  return a[1]-b[1]; // compare numbers
  	});
  	return sortable.reverse(); // array in format [ [ key1, val1 ], [ key2, val2 ], ... ]
  }

  var sortedCuisines=sortProperties(cuisineCount);
  var sortedCuisineRatings=sortProperties(averageRatings);

  var sortedZipcodes=sortProperties(zipCodeCount);
  var sortedZipRatings=sortProperties(zipRatings);

  var sortedPriceCount=sortProperties(priceCount);
  var sortedPriceRatings=sortProperties(priceRatings);

  console.log(sortedCuisineRatings);

  // //Write HTML Lists
  // var cuisineList = document.getElementById("cuisineList");
  // sortedCuisines.forEach(function(c) {
  //   var li = document.createElement('li');
  //   li.innerHTML = `${c[0]} - ${c[1]}`;
  //   cuisineList.appendChild(li);
  // })
  //
  // var cuisineRatingList = document.getElementById("cuisineRatingList");
  // sortedCuisineRatings.forEach(function(c) {
  //   var li = document.createElement('li');
  //   li.innerHTML = `${c[0]} - ${c[1]}`;
  //   cuisineRatingList.appendChild(li);
  // })
  //
  // var zipcodeList = document.getElementById("restaurantsZipcodeList");
  // sortedZipcodes.forEach(function(c) {
  //   var li = document.createElement('li');
  //   li.innerHTML = `${c[0]} - ${c[1]}`;
  //   zipcodeList.appendChild(li);
  // })
  //
  // var zipRatingList = document.getElementById("zipcodeRatingList");
  // sortedZipRatings.forEach(function(c) {
  //   var li = document.createElement('li');
  //   li.innerHTML = `${c[0]} - ${c[1]}`;
  //   zipRatingList.appendChild(li);
  // })
  //
  // var priceCountList = document.getElementById("restaurantsPriceList");
  // sortedPriceCount.forEach(function(c) {
  //   var li = document.createElement('li');
  //   li.innerHTML = `${c[0]} - ${c[1]}`;
  //   priceCountList.appendChild(li);
  // })
  //
  // var priceRatingList = document.getElementById("ratingsByPriceList");
  // sortedPriceRatings.forEach(function(c) {
  //   var li = document.createElement('li');
  //   li.innerHTML = `${c[0]} - ${c[1]}`;
  //   priceRatingList.appendChild(li);
  // })
});
