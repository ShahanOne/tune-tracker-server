require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('mongoose-type-url');
mongoose.set('strictQuery', false);
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // support json encoded bodies

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

// Artist.findOne({ name: 'CAS' }).then((thisArtist) => {
//   if (thisArtist) {
//     const newSong = new Song({
//       title: 'Cry',
//       artist: thisArtist,
//     });
//     newSong.save().then(() => console.log('saved song'));
//   }
// });

app.get('/api', (req, res) => {
  Song.find({}).then((foundSongs) => {
    if (foundSongs) {
      res.send(foundSongs);
    } else console.log('error');
  });
});

const port = process.env.PORT || 3001;

app.listen(port, function () {
  console.log('Server started on port 3001');
});
