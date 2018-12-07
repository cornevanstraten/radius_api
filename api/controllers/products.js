const mongoose = require('mongoose');
const multer = require('multer'); //bodyParser for files
const Product = require('../models/product');
const hostname = process.env.HOSTNAME;


exports.get_all = (req, res, next) => {
  Product.find()
    .select('name price _id productImage')
    .exec() //creates promise
    .then(docs => {
      const response = {
        count: docs.length,
        products: docs.map(doc => {
          return {
            name: doc.name,
            price: doc.price,
            _id: doc._id,
            productImage: doc.productImage,
            request: {
              type: 'GET',
              url: hostname + '/products/' + doc._id
            }
          }
        })
      }
      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      })
    });
}


exports.create_new = (req, res, next) => {
  console.log(req.file);
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path
  });
  product.save()
  .then(result => {
    console.log(result)
    res.status(201).json({
      message: 'Successfully created new product',
      createdProduct: {
        name: result.name,
        price: result.price,
        _id: result._id,
        request: {
          type: 'GET',
          url: hostname + '/products/' + result._id
        }
      }
    });
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({
      error: err
    })
  });
}


exports.get_product = (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
  .select('name price _id productImage')
  .exec()
  .then(doc => {
    console.log(doc);
    if(doc){
      res.status(200).json(doc);
    } else {
      res.status(404).json({
        message: 'No valid entry found'
      })
    }
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({error: err});
  });
}

exports.update_product = (req, res, next) => {
  const id = req.params.productId;
  const updateOps = {};
  for (const ops of req.body){
    updateOps[ops.propName] = ops.value;
  }
  Product.updateOne({_id: id}, {$set: updateOps})
  .exec()
  .then(result => {
    res.status(200).json({
      message: 'Product updated!',
      request: {
        type: 'GET',
        url: hostname + '/products/' + id
      }
    })
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    })
  });
}

exports.destroy = (req, res, next) => {
  const id = req.params.productId;
  Product.remove({_id: id}).exec()
  .then(result => {
    res.status(200).json({
      message: 'Product deleted'
    });
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
}
