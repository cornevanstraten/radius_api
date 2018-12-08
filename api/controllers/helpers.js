const mongoose = require('mongoose');
const multer = require('multer'); //bodyParser for files
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

exports.upload_image = (req, res, next) => {
  if(!req.file){
    return res.status(500).json({ error: "Image file required" })
  }
  cloudinary.v2.uploader.upload(req.file.path)
  .then(response => {
    res.status(201).json({
      message: 'Successfully uploaded image',
      image: {
        public_id: response.public_id,
        version: response.version,
        url: response.secure_url
      }
    })
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({
      error: err
    })
  });
}

exports.geocode = (req, res, next) => {
  console.log(req.body)
  if(!req.body.streetAddress){
    return res.status(500).json({ error: "Please provide a street address" })
  }
  googleMapsClient.geocode({address: req.body.streetAddress})
  .asPromise()
  .then((response) => {
    console.log(response.json.results);
    res.status(200).json({
      message: 'Successfully geocoded location',
      results: response.json.results,
    });
  })
  .catch((err) => {
    console.log(err);
    res.status(500).json({
      error: err
    })
  });
}
