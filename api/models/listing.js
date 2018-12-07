const mongoose = require('mongoose');

//parent | child Schema setup: https://mongoosejs.com/docs/subdocs.html
var miniUserSchema = new mongoose.Schema({
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
  educator: miniUserSchema
});


//schema is layout/design of the object
//model is the object itself and gives you a constructor, such as new User

module.exports = mongoose.model('Listing', listingSchema);
