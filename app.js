require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get('/', function (req, res) {
   // console.log('connected homepage')
    res.render('homePage')
  })

 
  app.get('/artist-search', function (req, res) {
      //console.log()
  spotifyApi
  .searchArtists(req.query.search)
  .then(data => {
      //console.log('DATA', data.body.artists.items)
   // console.log('The received data from the API: ', data.body);

    res.render('artist-search-results', {artists: data.body.artists.items} )
    
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:id', (req, res, next) => {
  //console.log('TESTTTTT2222', req.params)
  spotifyApi
  .getArtistAlbums(req.params.id)
  .then(album => {
    //console.log('ALBUM', album.body)
    res.render('albums', {albums: album.body.items})
  }) 
});


app.get('/tracks/:trackId', (req, res, next) => {
  spotifyApi
  .getAlbumTracks(req.params.trackId)
  .then(track => {
    res.render('tracks', {tracks: track.body.items})
  })
  .catch(err => console.log('The error while searching tracks occurred: ', err));
})

app.listen(5000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
