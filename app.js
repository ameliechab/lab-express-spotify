require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:

app.get("/", (req, res) => {
  res.render("homepage");
});

app.get("/artist-search", (req, res) => {
  spotifyApi
    .searchArtists(req.query.material)
    .then((data) => {
      const artist = data.body.artists.items;
      console.log("The received data from the API: ", artist);
      res.render("artist-search-results", { artist: artist });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
  //const filteredArtist = await Rubberduck.find({ material })
});

app.get("/albums/:id", (req, res) => {
  spotifyApi.getArtistAlbums(`${req.params.id}`).then(
    function (data) {
      const albumsById = data.body.items;
      console.log("Artist albums", albumsById);
      res.render("albums", { albumsById });
    },
    function (err) {
      console.error(err);
    }
  );
});

app.get("/track/:id", (req, res) => {
  spotifyApi.getAlbumTracks(`${req.params.id}`, { limit: 5, offset: 1 }).then(
    function (data) {
      const tracksById = data.body.items;
      console.log(tracksById);
      res.render("track", { tracksById });
    },
    function (err) {
      console.log("Something went wrong!", err);
    }
  );
});

//Search artist route

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
