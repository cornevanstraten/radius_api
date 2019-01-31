const mongoose = require('mongoose');

mongoose.set('useCreateIndex', true) //counters deprecated ensureIndex


//create geolocation
const geoSchema = new mongoose.Schema({
  type: {
    type: String,
    default: "Point"
  },
  coordinates: {
    type: [Number],
    index: "2dsphere" //creates an index
  }
})

//create addressLocation 

//parent | child Schema setup: https://mongoosejs.com/docs/subdocs.html
const miniUserSchema = new mongoose.Schema({
      firstName: {type: String, required: true},
      lastName: {type: String, required: true},
      avatar: {type: String, required: true},
      ref:  {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User"
            }
});


const listingSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  coverImage: {type: String, required: true}, //includes version
  title: {type: String, required: true},
  oneliner: {type: String, required: true},
  price: {type: Number, required: true},
  educator: miniUserSchema,
  geometry: geoSchema
});


//schema is layout/design of the object
//model is the object itself and gives you a constructor, such as new User

module.exports = mongoose.model('Listing', listingSchema);
