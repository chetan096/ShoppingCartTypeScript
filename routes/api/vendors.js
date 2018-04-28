// middleware route for this file
const route = require('express').Router()

// get Vendor table reference from connectionDB 
const Vendor = require('../../connectionDB').Vendor

// get vendors request comes here
route.get('/', (req, res) => {

  Vendor.findAll().then((vendors) => res.status(200).json(vendors)).catch((err) => {
    res.status(500).send({
      error: 'Could not get Vendors'
    })
  })
})

exports = module.exports = route
