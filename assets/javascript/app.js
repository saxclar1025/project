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

$(document.body).ready(function(){

});