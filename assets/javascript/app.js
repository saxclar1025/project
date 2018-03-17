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

var Result = function(name, distance, info, rating, url){
    this.name = name;
    this.distance = distance;
    this.info = info;
    this.rating = rating;
    this.url = url;
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

var yelpSearcher {
    //Look here for Yelp categories
    //https://www.yelp.com/developers/documentation/v3/all_category_list
    category: null,
    zip: null,
    categories: [ "(active, All)",
                  "(food, All)",
                  "(tours, All)",
                  "(bars, All)",
                  "(karaoke, All)",
                  "(restaurants, All)",
                  "(comedyclubs, US)",
                  "(danceclubs, All)"
    ],

    setCategory: function(categoryID) {
        this.category = categories[categoryID];
    },

    search: function() {
        var settings = {
          "async": true,
          "crossDomain": true,
          "url": "https://api.yelp.com/v3/businesses/search?categories=" + this.category + "&location=" + this.zip,
          "method": "GET",
          "headers": {
            "content-type": "multipart/form-data",
            "authorization": "Bearer Mh1ZWFGBqHPe9M8fVJD20Nw2CoIIQLe_M7bnbMZ3nBnTa92KHKZjEm1eaByWnCWsuQYR4ZSo0jG11YctVk1q6mhAylw_PiHfhjzdytMULhdPn4zcz_hsdUqwZBGrWnYx"
          }
        }

        $.ajax(settings).done(function (response) {
          console.log(response);
        });
    },
};

$(document.body).ready(function(){

});