var config = {
    apiKey: "AIzaSyD117KRn5q_2rOItAYV5Coej9TpwDCNcvw",
    authDomain: "wtf-todo-5b04d.firebaseapp.com",
    databaseURL: "https://wtf-todo-5b04d.firebaseio.com",
    projectId: "wtf-todo-5b04d",
    storageBucket: "",
    messagingSenderId: "726104455374"
  };
firebase.initializeApp(config);
var database = firebase.database();

var Result = function(name, distance, info, rating, url, imgUrl){
    this.name = name;
    this.distance = distance;
    this.info = info;
    this.rating = rating;
    this.url = url;
    this.imgUrl = imgUrl;
};

var appUI = {
    nthResultDivSelector: function(i) {
        return "#results-div div:nth-child(" + (i + 1) + ")";
    },

    //i is index from 0 (left) to 2 (right)
    updateResult: function(i, result) {
        $(this.nthResultDivSelector(i)+" .name").text(result.name);
        $(this.nthResultDivSelector(i)+" .distance").text(result.distance);
        $(this.nthResultDivSelector(i)+" .info").text(result.info);
        $(this.nthResultDivSelector(i)+" .rating").text(result.rating);
    }

};

var distanceBetween = function(zip1, zip2, callback){
 var distance = -1;

 var settings = {
   "async": true,
   "crossDomain": true,
   "url": "https://maps.googleapis.com/maps/api/distancematrix/json?origins=" + zip1 + "&destinations=" + zip2 + "&units=imperial",
   "method": "GET",
   "headers": {
     "authorization": "Bearer AIzaSyC4yiqbLh3IwdsjS_YCxHlpUodQcblsEHU"
   }
 }
 $.ajax(settings).done(function (response) {
   console.log(response);
   distance = response.rows[0].elements[0].distance.value / 1609.344;
   callback(distance);
 });
};

var yelpSearcher = {
    //Look here for Yelp categories
    //https://www.yelp.com/developers/documentation/v3/all_category_list
    category: "",
    zip: "",
    categories: [ "(active, All)",
                  "(food, All)",
                  "(tours, All)",
                  "(bars, All)",
                  "(karaoke, All)",
                  "(restaurants, All)",
                  "(comedyclubs, US)",
                  "(danceclubs, All)"
    ],

    results: [],

    setCategory: function(categoryID) {
        this.category = this.categories[categoryID];
    },

    search: function() {
        var thisObject = this;
        var resultArray = [];

        jQuery.ajaxPrefilter(function(options) {
            if (options.crossDomain && jQuery.support.cors) {
                options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
            }
        });

        var settings = {
          "async": true,
          "crossDomain": true,
          "url": "http://api.yelp.com/v3/businesses/search?categories=(active%2C%20All)&location=33331",
          "method": "GET",
          "headers": {
            "content-type": "multipart/form-data",
            "authorization": "Bearer Mh1ZWFGBqHPe9M8fVJD20Nw2CoIIQLe_M7bnbMZ3nBnTa92KHKZjEm1eaByWnCWsuQYR4ZSo0jG11YctVk1q6mhAylw_PiHfhjzdytMULhdPn4zcz_hsdUqwZBGrWnYx"
          }
        }

        $.ajax(settings).done(function (response) {
          response.businesses.forEach(function(item){
            resultArray.push(new Result(item.name,
                                        item.categories.map(function(item){return item.title;}).join(", "),
                                        item.distance / 1609.344,
                                        item.rating,
                                        item.url,
                                        item.image_url));
          });
        });

        thisObject.results = resultArray;
        return resultArray;
    }
};

var seatGeekSearcher = {
    category: "",
    zip: "",
    categories: [ "Sports",
                  "Concerts",
                  "Concert",
                  "Music Festivals",
                  "Theatre",
                  "Comedy"
    ],

    results: [],

    setCategory: function(categoryID) {
        this.category = this.categories[categoryID];
    },

    search: function() {
        var thisObject = this;
        var resultArray = [];
        

        var settings = {
          "async": true,
          "crossDomain": true,
          "url": "https://api.seatgeek.com/2/events?geoip=" + thisObject.zip + "&range=25mi&taxonomies.name=" + thisObject.catagory + "&client_id=OTk5NTUwMXwxNTIxNTA3NzUzLjcz",
          "method": "GET"
        }

        $.ajax(settings).done(function (response) {
          response.events.forEach(function(item){
            var newResult = new Result(item.title,
                                        item.taxonomies.map(
                                          function(item){
                                            var words = item.name.split("_");
                                            words.forEach(function(word){
                                              word = word.charAt(0).toUpperCase() + word.slice(1);  
                                            });
                                            return words.join(" ");
                                          }).join(", "),
                                        0,
                                        item.score * 5,
                                        item.url,
                                        item.performers[0].image);
            distanceBetween(thisObject.zip, item.venue.postal_code, function(distance){newResult.distance = distance;});
            resultArray.push(newResult);
          });
        });

        thisObject.results = resultArray;
        return resultArray;
    }
};


$(document.body).ready(function(){
    yelpSearcher.zip = 33020;
    yelpSearcher.setCategory(3);
    yelpSearcher.search();
    console.log(yelpSearcher.results);
});