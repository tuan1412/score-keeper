const mongoose = require('mongoose');
const { Schema } = mongoose;

const GameShema = new Schema({
  players: [String],
  scores: {
    type: [[Number]],
    default: [[0, 0, 0, 0]]
  }
});

module.exports = mongoose.model('game', GameShema)