const mongoose = require('mongoose');
const User = require('../models/user');
const Listing = require('../models/listing');

// const orderSchema = mongoose.Schema({
//   _id: mongoose.Schema.Types.ObjectId,
//   product: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Product',
//     required: true
//   },
//   quantity: {type: Number, default: 1}
// });

const orderSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  createdAt: { type: Date, default: Date.now},
  listing: {
    ref: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing',
      required: true,
    },
    details: {
      _id: mongoose.Schema.Types.ObjectId,
      coverImage: {type: String, required: true}, //includes version
      title: {type: String, required: true},
      oneliner: {type: String, required: true},
      description: {type: String, required: true},
      price: {type: Number, required: true},
      // educator: miniUserSchema,
      location: {
        street_number: {type: String, required: true},
        street_name: {type: String, required: true},
        city: {type: String, required: true},
        state: {type: String, required: true},
        country: {type: String, required: true},
        ZIP: {type: String, required: true}
      },
      // geometry: geoSchema,
      when: { type: Date, required: true}
    }
  },
  educator: {
    ref: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    details: {
      firstName: {type: String, required: true},
      lastName: {type: String, required: true},
      avatar: {type: String, required: true},
    }
  },
  student: {
    ref: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    details: {
      firstName: {type: String, required: true},
      lastName: {type: String, required: true},
      avatar: {type: String, required: true},
    },
  }
})

//schema is layout/design of the object
//model is the object itself and gives you a constructor, such as new User

module.exports = mongoose.model('Order', orderSchema);
