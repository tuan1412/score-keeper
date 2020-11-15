const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const dotEnv = require('dotenv');
const GameModel = require('./models/game');

dotEnv.config()

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
  if (err) throw err;
  console.log('mongodb connect');
});

const app = express();
app.listen(process.env.PORT, (err) => {
  if (err) throw err;
  console.log('server start')
});

app.use(bodyParser.urlencoded({ extended: true }));

const clientFolder = process.env.CLIENT_FOLDER; 
app.use(express.static(clientFolder));

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, `./${clientFolder}/html/home.html`));
});

app.get('/game/:idGame', (req, res) => {
  res.sendFile(path.resolve(__dirname, `./${clientFolder}/html/game.html`));
});

app.post('/api/games', async (req, res) => {
  const { players } = req.body;

  const newGame = await GameModel.create({
    players
  });

  res.send({ success: 1, data: newGame });
});

app.get('/api/games/:idGame', async (req, res) => {
  const { idGame } = req.params;

  const newGame = await GameModel.findById(idGame);

  if (newGame) {
    return res.send({ success: 1, data: newGame });
  }

  res.send({ success: 0 });
});


app.put('/api/games/:idGame', async (req, res) => {
  const { idGame } = req.params;
  const { scores } = req.body;
  
  const foundGame = await GameModel.findById(idGame);

  if (!foundGame) {
    res.send({ success: 0 });
  }

  foundGame.scores = scores;
  await foundGame.save();

  return res.send({ success: 1, data: foundGame });
});

