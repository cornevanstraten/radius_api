const Listing = require('../models/listing');


module.exports = (req, res, next) => {
  const listingId = req.params.listingId;
  Listing.findById(listingId)
  .select('educator')
  .exec()
  .then(foundListing => {
    if(foundListing.educator.ref == req.userData.userId){
      next()
    } else {
      res.status(201).json({
        message: 'You are not authorized'
      })
    }
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({error: err});
  });
}
