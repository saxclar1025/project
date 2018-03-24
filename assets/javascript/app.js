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

jQuery.ajaxPrefilter(function(options) {
    if (options.crossDomain && jQuery.support.cors) {
        options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
    }
});

var zip = null;
var results = [];
var currentResult = null;

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
        // return "#results-div div:nth-child(" + (i + 1) + ")";
        return "#result" + (i + 1);
    },

    //i is index from 0 (left) to 2 (right)
    updateResult: function(i, result) {
        $(this.nthResultDivSelector(i)+" .name").text(result.name);
        $(this.nthResultDivSelector(i)+" .distance").text(result.distance.toFixed(1) + " Miles away");
        $(this.nthResultDivSelector(i)+" .info").text(result.info);
        $(this.nthResultDivSelector(i)+" .rating").text(result.rating.toFixed(1) + " Stars");
        $(this.nthResultDivSelector(i)+" .info-btn").attr("href", result.url);
    },

    updateResultsGroup: function(i, results) {
      for (var j = 0; j < 3; j++) {
        if (results[i * 3 + j]){
          this.updateResult(j,results[i * 3 + j]);
          $(this.nthResultDivSelector(j)).show();
        }
        else {
          $(this.nthResultDivSelector(j)).hide();
        }
      }
    },

    updateMoreInfo: function() {
      $(".more-info #result-img").attr("src", currentResult.imgUrl);
      $(".more-info .name").text(currentResult.name);
      $(".more-info .distance").text(currentResult.distance.toFixed(1) + " Miles away");
      $(".more-info .info").text(currentResult.info);
      $(".more-info .rating").text(currentResult.rating.toFixed(1) + " Stars");
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
   distance = response.rows[0].elements[0].distance.value / 1609.344;
   callback(distance);
   appUI.updateResultsGroup(0,results);
 });
};

var yelpSearcher = {
    //Look here for Yelp categories
    //https://www.yelp.com/developers/documentation/v3/all_category_list
    category: "",
    zip: "",
    categories: [ "active",
                  "food",
                  "tours",
                  "bars",
                  "karaoke",
                  "restaurants",
                  "danceclubs"
    ],

    // results: [],

    setCategory: function(categoryID) {
        this.category = this.categories[categoryID];
    },

    search: function() {
        var thisObject = this;
        var resultArray = [];

        var settings = {
          "async": true,
          "crossDomain": true,
          "url": "http://api.yelp.com/v3/businesses/search?categories=" + thisObject.category + "&location=" + thisObject.zip,
          "method": "GET",
          "headers": {
            "content-type": "multipart/form-data",
            "authorization": "Bearer Mh1ZWFGBqHPe9M8fVJD20Nw2CoIIQLe_M7bnbMZ3nBnTa92KHKZjEm1eaByWnCWsuQYR4ZSo0jG11YctVk1q6mhAylw_PiHfhjzdytMULhdPn4zcz_hsdUqwZBGrWnYx"
          }
        }

        $.ajax(settings).done(function (response) {
          response.businesses.forEach(function(item){
            resultArray.push(new Result(item.name,
                                        item.distance / 1609.344,
                                        item.categories.map(function(item){return item.title;}).join(", "),
                                        item.rating,
                                        item.url,
                                        item.image_url));
          });
          results = resultArray;
          appUI.updateResultsGroup(0, results);
        });
    }
};

var seatGeekSearcher = {
    category: "",
    zip: "",
    categories: [ "Sports",
                  "Concert",
                  "Music Festivals",
                  "Theatre",
                  "Comedy"
    ],

    // results: [],

    setCategory: function(categoryID) {
        this.category = this.categories[categoryID];
    },

    search: function() {
        var thisObject = this;
        var resultArray = [];
        

        var settings = {
          "async": true,
          "crossDomain": true,
          "url": "https://api.seatgeek.com/2/events?geoip=" + thisObject.zip + "&range=25mi&taxonomies.name=" + thisObject.category + "&client_id=OTk5NTUwMXwxNTIxNTA3NzUzLjcz",
          "method": "GET"
        }

        $.ajax(settings).done(function (response) {
          response.events.forEach(function(item){
            var newResult = new Result( item.title,
                                        0,
                                        item.taxonomies.map(
                                          function(item){
                                            var words = item.name.split("_");
                                            words.forEach(function(word){
                                              word = word.charAt(0).toUpperCase() + word.slice(1);  
                                            });
                                            return words.join(" ");
                                          }).join(", "),
                                        item.score * 5,
                                        item.url,
                                        item.performers[0].image);
            distanceBetween(thisObject.zip, item.venue.postal_code, function(distance){newResult.distance = distance;});
            resultArray.push(newResult);
          });
          results = resultArray;
          appUI.updateResultsGroup(0, results);
        });
    }
};


$(document.body).ready(function(){
  zip = localStorage.getItem('zip');
  yelpSearcher.zip = zip;
  seatGeekSearcher.zip = zip;
  appUI.updateResultsGroup(0,results);
  currentResult = localStorage.getItem("result");
  appUI.updateMoreInfo();
});

// var vueInstance = new Vue ({
//     el: '#app1',
//     data:{
//         show: false,
//         displayResults: function() {
//             vueInstance.show = !vueInstance.show;
//         }
//     },
// })

$('#submit-btn').click(function(){
    zip = $('#userZIP').val();
    localStorage.setItem('zip', zip);
    database.ref('zip').push(zip);
});

$("form").on("submit", function(){
  event.preventDefault();
  zip = $('#userZIP').val();
  localStorage.setItem('zip', zip);
  database.ref('zip').push(zip);
  window.location.href = 'search.html';
});

jQuery(function(){
    $('#right-btn').click(function(){
        
    });
    $('#left-btn').click(function(){

    });
})

$('.img-cat').click(function(){
  if ($(this).attr("searcher") === "yelp") {
    yelpSearcher.setCategory($(this).attr('categoryId'));
    yelpSearcher.search();
  }
  if ($(this).attr("searcher") === "seatGeek") {
    seatGeekSearcher.setCategory($(this).attr('categoryId'));
    seatGeekSearcher.search();
  }
});

$(".info-btn").click(function(){
  localStorage.setItem("result", results[$(this).attr("resultID")]);
});