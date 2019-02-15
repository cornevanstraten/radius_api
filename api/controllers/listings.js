const mongoose = require('mongoose');
const multer = require('multer'); //bodyParser for files
const Listing = require('../models/listing');
const hostname = process.env.HOSTNAME;
const cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: 'openclassroom',
  api_key: process.env.CLAPIKEY,
  api_secret: process.env.CLAPISECRET
});

const googleMapsClient = require('@google/maps').createClient({
  key: process.env.GAPIKEY,
  Promise: Promise
});


exports.get_all = (req, res, next) => {
  Listing.find()
    .select('title price oneliner _id coverImage educator geometry')
    .exec() //creates promise
    .then(docs => {
      const response = {
        count: docs.length,
        listings: docs.map(doc => {
          return {
            title: doc.title,
            price: doc.price,
            oneliner: doc.oneliner,
            _id: doc._id,
            coverImage: doc.coverImage,
            educator: doc.educator,
            geometry: doc.geometry,
            request: {
              type: 'GET',
              url: hostname + '/listings/' + doc._id
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

// /listings?lng=51.90&lat=4.47&distance=100&search=koek+monster
exports.geo_get = (req, res, next) => {
  const regex = new RegExp(escapeRegex(req.query.search), "gi");
  const pricemax = parseFloat(req.query.pricemax)
  Listing.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [parseFloat(req.query.lng), parseFloat(req.query.lat)]
        },
        distanceField: "dist.calculated",
        maxDistance: parseFloat(req.query.distance)*1609.344, //meters to miles
        query: { //consider refactoring queries for different scenarios
            $or: [
                {title: regex},
                {oneliner: regex},
                {description: regex}
              ],
              price: { $lt: pricemax || 10000}
        },
        spherical: true
      }
    }
  ])
    .then(docs => {
      const response = {
        count: docs.length,
        listings: docs
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
    const listing = new Listing({
      _id: new mongoose.Types.ObjectId(),
      coverImage: req.body.coverImage,
      title: req.body.title,
      oneliner: req.body.oneliner,
      price: req.body.price,
      educator: {
        firstName: req.userData.firstName,
        lastName: req.userData.lastName,
        avatar: req.userData.avatar,
        ref: req.userData.userId
      },
      geometry: {
        type: 'Point',
        coordinates: req.body.coordinates
      }
    });
    return listing.save()
  // })
  .then(result => {
    console.log(result)
    res.status(201).json({
      message: 'Successfully created new listing',
      createdListing: {
        title: result.title,
        oneliner: result.oneliner,
        price: result.price,
        coverImage: result.coverImage,
        educator: result.educator,
        geometry: result.geometry,
        _id: result._id,
        request: {
          type: 'GET',
          url: hostname + '/listings/' + result._id
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


exports.get_listing = (req, res, next) => {
  const id = req.params.listingId;
  Listing.findById(id)
  .select('title oneliner price _id coverImage educator geometry')
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

exports.update_listing = (req, res, next) => {
  console.log(req.body)
  const id = req.params.listingId;
  const updateOps = {};
  for (const ops of req.body){
    updateOps[ops.propName] = ops.value;
  }
  console.log(updateOps)
  Listing.updateOne({_id: id}, {$set: updateOps})
  .exec()
  .then(result => {
    res.status(200).json({
      message: 'Listing updated!',
      request: {
        type: 'GET',
        url: hostname + '/listings/' + id
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
  const id = req.params.listingId;
  Listing.remove({_id: id}).exec()
  .then(result => {
    res.status(200).json({
      message: 'Listing deleted'
    });
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
}






//non-routes

function escapeRegex(text){
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
