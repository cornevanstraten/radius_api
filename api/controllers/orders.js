const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');

const hostname = process.env.HOSTNAME;

exports.get_all = (req, res, next) => {
  Order.find()
  .select('product quantity _id')
  .populate('product', 'name') //second argument is fields to be populated
  .exec()
  .then(docs => {
    res.status(200).json({
      count: docs.length,
      orders: docs.map(doc => {
        return {
          _id: doc._id,
          product: doc.product,
          quantity: doc.quantity,
          request: {
            type: "GET",
            url: hostname + "/orders/" + doc._id
          }
        };
      })
    });
  })
  .catch(err => {
    res.status(500).json({
      error: err
    })
  });
}

exports.create_new = (req, res, next) => {
  Product.findById(req.body.productId)
  .then(product => {
    if(!product){
      return res.status(404).json({ // return means rest won't be executed
        message: 'Product not found'
      });
    }
    const order = new Order(
    {
      _id: mongoose.Types.ObjectId(),
      product: req.body.productId,
      quantity: req.body.quantity
    });
    return order
    .save()
  })
  .then(result => {
    console.log(result)
    res.status(201).json({
      message: 'New order placed:',
      createdOrder: {
        _id: result._id,
        product: result.product,
        quantity: result.quantity
      },
      request: {
        type: 'GET',
        url: hostname + '/orders/' + result._id
      }
    });
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    })
  });
}

exports.get_order = (req, res, next) => {
  Order.findById(req.params.orderId)
  .populate('product')
  .exec()
  .then(order => {
    if(!order){
      return res.status(404).json({
        message: 'order not found'
      })
    }
    res.status(200).json({
      order: order,
      request: {
        type: 'GET',
        url: hostname + '/orders'
      }
    })
  })
  .catch(err => {
    res.status(500).json({
      error: err
    })
  })
}

exports.delete_order = (req, res, next) => {
  Order.remove({ _id: req.params.orderId})
  .exec()
  .then(result => {
    res.status(200).json({
      message: 'Order deleted',
      request: {
        type: 'POST',
        url: hostname + '/orders'
      }
    })
  })
  .catch(err => {
    res.status(500).json({
      error: err
    })
  });
}
