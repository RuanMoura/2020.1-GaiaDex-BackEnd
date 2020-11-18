const mongoose = require('mongoose');

const PlantSchema = new mongoose.Schema({
  scientificName: {
    type: String,
    require: true,
    unique: true,
  },
  familyName: {
    type: String,
    require: true,
  },
  genderName: {
    type: String,
    require: true,
  },
  specieName: {
    type: String,
    require: true,
  },
  commonName: {
    type: String,
    require: true,
  },
  usage: {
    type: String,
    require: true,
  },
  firstUser: {
    type: String,
    require: true,
  },
  collectionCount: {
    type: Number,
    require: true,
  },
  extinction: {
    type: Boolean,
    require: true,
  },
  profilePicture: {
    type: String,
    require: true,
  },
  gbifID: {
    type: Number,
    require: true,
  },
  stateProvince: {
    type: String,
    require: true,
  },
  topics: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topic',
    },
  ],
});

const Plant = mongoose.model('Plant', PlantSchema);

module.exports = Plant;
