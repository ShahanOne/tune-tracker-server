require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('mongoose-type-url');
mongoose.set('strictQuery', false);
const path = require('path');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // support json encoded bodies
const { json } = require('body-parser');

const cors = require('cors');
const corsOptions = {
  origin: '*',
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
//Connection
mongoose.connect(
  // 'mongodb://localhost:27017/videosDB'
  `mongodb+srv://Shahan786:${process.env.MONGO_PASSWORD}@cluster0.ma0c6.mongodb.net/musicsDB`
);

//Schema  i.e the structure we want for data
const artistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  artist: artistSchema,
});

//Model
const Artist = mongoose.model('Artist', artistSchema);
const Song = mongoose.model('Song', songSchema);

app.get('/getSongs', (req, res) => {
  Song.find({}).then((foundSongs) => {
    if (foundSongs) {
      res.send(foundSongs);
    } else console.log('error');
  });
});

app.post('/addSong', async (req, res) => {
  try {
    const data = req.body;
    const title = data.title;
    const artist = data.artist;
    let thisArtist = await Artist.findOne({ name: artist });

    if (!thisArtist) {
      thisArtist = new Artist({
        name: artist,
      }).save();
    }
    const newSong = new Song({
      title: title,
      artist: thisArtist,
    });
    await newSong.save();
    res.send(newSong);
  } catch (err) {
    console.log(err);
    res.send('Server Error');
  }
});

app.get('/getArtistSongs/:artist', async (req, res) => {
  const artist = req.params.artist;
  let theArtist = await Artist.findOne({ name: artist });
  Song.find({ artist: theArtist }).then((foundSongs) => {
    res.send(foundSongs);
  });
});

app.get('/getSongData/:song', async (req, res) => {
  const song = req.params.song;
  let theSong = await Song.findOne({ title: song });
  res.send(theSong);
});
const port = process.env.PORT || 3001;

app.listen(port, function () {
  console.log('Server started on port 3001');
});
