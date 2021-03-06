const mongoose = require('mongoose');

mongoose.set('useCreateIndex', true) //counters deprecated ensureIndex


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

const locationSchema  = new mongoose.Schema({
  street_number: {type: String, required: true},
  street_name: {type: String, required: true},
  city: {type: String, required: true},
  state: {type: String, required: true},
  country: {type: String, required: true},
  ZIP: {type: String, required: true}
})

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
  // createdAt: {type: Date, default: Date.now},
  isActive: {type: Boolean, default: true},
  coverImage: {type: String, required: true}, //includes version
  title: {type: String, required: true},
  oneliner: {type: String, required: true},
  description: {type: String, required: false},
  // tags: [{type: String, required: false}],
  price: {type: Number, required: true},
  educator: miniUserSchema,
  location: locationSchema,
  geometry: geoSchema,
  time: {
    startUTC: {type: Date, required: false},
    endUTC: {type: Date, required: false},
    duration: {type: Number, required: false}, //minutes
    timeZone: {type: String, required: false},
    isRecurring: {type: Boolean, required: false},
    recurrancePattern: { // iCal RFC
      freq: {type: String, required: false},  //DAILY
      interval: {type: Number, default: 1},   //7 (weekly)
      count: {type: Number, default: 1},      //3 (three sessions)
    }
  },
  portfolio: {
    pictures: [{type: String, required: false}],//array of picture links
    assets: [{type: String, required: false}]//array of pdf links
  }
});

// listingSchema.index({ title: 'text', oneliner: 'text', description: 'text'}) //creates index


//schema is layout/design of the object
//model is the object itself and gives you a constructor, such as new User

module.exports = mongoose.model('Listing', listingSchema);
