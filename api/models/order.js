const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {type: Number, default: 1}
});


//schema is layout/design of the object
//model is the object itself and gives you a constructor, such as new User

module.exports = mongoose.model('Order', orderSchema);
