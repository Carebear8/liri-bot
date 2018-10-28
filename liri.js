// config method 

var express = require('express');
var app = express();
var moment = require('moment');
var fs = require('fs');
var Spotify = require(`node-spotify-api`);
app.listen(3000);

require("dotenv").config()
var keys = require("./keys");
var request = require("request-promise");
var spotifyBaseUrl = "https://api.spotify.com/v1";
var spotify = new Spotify(keys.spotify);
var fs = require("fs");

//  var spotify = new Spotify(keys.spotify);

// console.dir(moment);

console.dir(fs);

var command = process.argv[2];
var argument = process.argv[3];
console.log(command, argument);
if (!argument) argument = "Mr.Nobody";

var urls = {
  bandsInTown: "https://rest.bandsintown.com/artists/" + argument + "/events?app_id=codingbootcamp",
  spotifyUrl: `${spotifyBaseUrl}?q=${argument}&type=track`,
  OMDB: `http://www.omdbapi.com/?apikey=trilogy&t=${argument}`
}

function requester(url, callback) {
  request(url)
    .then(function (res) {
      callback(JSON.parse(res));
    })
    .catch(function (err) {
      console.log(err);
    });
}

switch (command) {
  case "concert-this":
    var data = requester(urls.bandsInTown, function (data) {
      data.map(concert => {
        console.log(`name: ${concert.venue.name}`);
        console.log(`location:${concert.venue.city}`);
        console.log(`date: ${moment(concert.datetime).format('MM/DD/YYYY')}`);
      })
    });


    break;
  case "spotify-this-song":
    spotify.search({
      type: 'track',
      query: argument,
      limit: 1
    }, function (err, data) {
      if (err) throw err;
      var track = data.tracks.items[0];
      var album = track.album.name;
      var artist = track.artists[0].name
      var previewLink = track.external_urls.spotify;
      var song = track.name;

      console.log(`artist: ${artist}`);
      console.log(`song: ${song}`);
      console.log(`previewLink: ${previewLink}`);
      console.log(`album: ${album}`)
    })
    break;
    case "movie-this":
      requester(urls.OMDB, function(movie){
        console.log(`title: ${movie.Title}`);
        console.log(`year: ${movie.Year}`);
        console.log(`imdb Rating: ${movie.Ratings[0].Value}`);
        console.log(`rotten Tom Rating: ${movie.Ratings[1].Value}`);
        console.log(`country: ${movie.Country}`);
        console.log(`language: ${movie.Language}`);
        console.log(`plot: ${movie.Plot}`);
        console.log(`actors: ${movie.Actors}`);
      })
    break;
    case "do-what-it-says":
      var obj = {
        type: 'track',
        query: "I Want It That Way",
        limit: 1
      }
      spotify.search(obj, (err, data) => {
        if (err) throw err;
        var track = data.tracks.items[0];
        var album = track.album.name;
        var artist = track.artists[0].name
        var previewLink = track.external_urls.spotify;
        var song = track.name;
        var path = "./random.txt";
        var data = `track: ${track}\n album: ${album}\n artist:${artist}\n previewLink: ${previewLink}\n song:${song}\n`;
        fs.writeFile(path, data, err => {
           if (err) throw err;
           console.log("success");
        });
      })
      

}

 


