require("dotenv").config();
var keys = require("./keys.js");

var request = require('request');
var Spotify = require('node-spotify-api');
var twitter = require('twitter');
var fs = require('fs');

var spotify = new Spotify(keys.spotify);
var omdbKey = keys.omdb;
var twitter = new Twitter(keys.twitter);

var liriAction = process.argv[2];


switch(liriAction){
  case 'movie-this':
    omdb();
    break;

  case 'my-tweets':
    twitter();
    break;

  case 'spotify-this-song':
    spotifySearch();
    break;

  default:
    console.log('Sorry, I didn\'t understand that. You can try:\nmovie-this\nmy-tweets\nspotify-this-song');
    break;
};


function omdb(){

  //grab first element
  var queryString = process.argv[3];

  //if there are addtional words concatenate them onto the query
  if(process.argv[4]){
    for (var i = 4; i < process.argv.length; i++) {
      queryString += '+' + process.argv[i];
    }
  }

  if(!queryString){ 
    //if the user did not provide anything, set search to Mr Nobody
    queryString = 'Mr.+Nobody';
    var apiURL = 'http://www.omdbapi.com/?apikey=' + omdbKey + '&t=' + queryString;
    omdbSearch(apiURL);
  } else { //else, run search as normal
    var apiURL = 'http://www.omdbapi.com/?apikey=' + omdbKey + '&t=' + queryString;
    omdbSearch(apiURL);
  }

};

//run the API and format the results
function omdbSearch(urlRef){

  request(urlRef, function (error, response, body) {

    if(!error && response.statusCode === 200){
      
      console.log('######################################################');
      console.log('#');
      console.log('#               ' + JSON.parse(body).Title);
      console.log('#');
      console.log('######################################################');
      console.log('');

      console.log('Release Year: ' + JSON.parse(body).Year);

      if(JSON.parse(body).Ratings[0].Value){
        console.log('IMDB rating: ' + JSON.parse(body).Ratings[0].Value);
      };

      if(JSON.parse(body).Ratings[1].Value){
        console.log('Rotten Tomatoes rating: ' + JSON.parse(body).Ratings[1].Value);
      };
      
      console.log('Produced in: ' +JSON.parse(body).Country);
      console.log('Language: ' + JSON.parse(body).Language);
      console.log('Plot: ' + JSON.parse(body).Plot);
      console.log('Actors: ' + JSON.parse(body).Actors);
      console.log('');
      console.log('######################################################');
    }

    if (error || response.statusCode === 400){
      console.log('Whoops, I had an error. Please try again.');
    }


  });
};

function spotifySearch(){

  //grab first element
  var spotifyString = process.argv[3];

  //if there are addtional words concatenate them onto the query
  if(process.argv[4]){
    for (var i = 4; i < process.argv.length; i++) {
      spotifyString += ' ' + process.argv[i];
    }
  }

spotify.search({ type: 'track', query: spotifyString, limit: 1 }, function(err, data) {
  if (err) {
    return console.log('Error occurred: ' + err);
  }
 
console.log(JSON.stringify(data, null, 2));

var apiReturn = data.tracks.items[0];
var artistName = apiReturn.artists[0].name;
var songName = apiReturn.name;
var songURL = apiReturn.album.external_urls.spotify;
var albumName = apiReturn.album.name;

console.log("Artist Name: " + artistName + '\nSong Name: ' + songName + "\nPreview URL: " + songURL + "\nAlbum Name: " + albumName);

});

};

function twitter(){

};