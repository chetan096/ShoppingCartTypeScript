// get Product Table instance from connectionDB.js
//const Product = require('../../connectionDB').Product; // current file->parent->parent folder->db.js
import {_Product} from '../../connectionDB';
// Vendor instance
//const Vendor = require('../../connectionDB').Vendor
import {_Vendor} from '../../connectionDB';
// middleware route for this file
//const route = require('express').Router()
import {Request,Router} from 'express';

const route:Router=Router();

interface RequestBody {
  [k: string]: string
}
export class Product{
  public id:number;
  public name:string;
  public price:number;
  constructor(id:number,name:string,price:number){
    this.id=id;
    this.name=name;
    this.price=price;
  }
}

// get product request comes here
route.get('/', (req:Request, res:any) => {
  _Product.findAll({
    include: [{
      model: _Vendor
    }]
  }).then((products:Product[]) => {
    res.status(200).json(products)
  }).catch((error:any) => {
    res.status(500).send({
      error: 'Could not retrieve Products'
    })
  })
})
// post request for product comes here
route.post('/', (req:Request, res:any) => {
  const body:RequestBody=req.body;
  // if price not a number
  var price:number=parseFloat(body.price);
  if (isNaN(price)) {
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
  _Product.create({
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
export default route
