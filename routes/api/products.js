// get Product Table instance from connectionDB.js
const Product = require('../../connectionDB').Product; // current file->parent->parent folder->db.js
// Vendor instance
const Vendor = require('../../connectionDB').Vendor
// middleware route for this file
const route = require('express').Router()

// get product request comes here
route.get('/', (req, res) => {
  Product.findAll({
    include: [{
      model: Vendor
    }]
  }).then((products) => {
    res.status(200).json(products)
  }).catch((error) => {
    res.status(500).send({
      error: 'Could not retrieve Products'
    })
  })
})
// post request for product comes here
route.post('/', (req, res) => {
  // if price not a number
  if (Number.isNaN(parseFloat(req.body.price))) {
    return res.status(403).send({
      error: 'Please enter valid price'
    })
  }
  if (!req.user) {
   return res.status(403).send({
      error: 'Please login before adding Products'
    })
  }
  // create product instance in product table
  Product.create({
    name: req.body.name,
    price: parseFloat(req.body.price),
    vendorId: req.body.vendorId
  }).then((product) => {
    res.status(201).send(product)
  }).catch((err) => {
    res.status(501).send({
      error: 'Could Not add new Product'
    })
  })
})
exports = module.exports = route
