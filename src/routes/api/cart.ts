//get Cart table instance from connectionDB
//const Cart = require('../../connectionDB').Cart;//current file->parent->parent folder->db.js
import {_Cart} from '../../connectionDB';
//middleware route for this file requests
//const route = require('express').Router();
import {Request,Router} from 'express';
const route:Router=Router();
//Product Table instance
import {_Product} from '../../connectionDB';
//const Product = require('../../connectionDB').Product;

//const User=require('../../connectionDB').User;
import {_User} from '../../connectionDB';
import { User } from './users';
import {Product} from './products'
interface RequestBody {
    [k: string]: string
  }

export class Cart{
   public id:number;
   public quantity:number;
   public amount:number;
   constructor(id:number,quantity:number,amount:number){
       this.id=id;
       this.quantity=quantity;
       this.amount=amount;
   }
   
}

//get request for cart comes here
route.get('/', (req:Request, res) => {
   // const body:RequestBody=req.body;
    if(!req.user){
       return res.redirect('/login.html');
    }
    //get cart function returns array of sequelize objects in cart send as json response
    getCart(req).then((cart) => res.status(200).json(cart)).catch((err) => {
        res.status(500).send({
            error: "Could not get Cart"
        })
    });
})

//adding product to cart request comes here
route.post('/', (req:Request, res) => {

    if (!req.user) {
        return res.status(403).send({
           error: 'Please login before adding products to cart'
         })
       }
    //find cart entry for corresponding product id in cart table if no item then add new entry otherwise update quantity of that cart entry
    _Cart.findOne({
        where: {
            productId: req.body.productId,
            userId:req.user.id
        },
        include: [{
            model: _Product
        }]
    }).then((item:any) => {
        //if item found update quantity
       // var set:_Cart.set;
        if (item != null) {
            item.set('quantity', item.quantity + 1);
            item.set('amount', item.amount + item.product.price)
            item.save().then((item:any) => {
                res.status(200).send(item);
            }).catch((err:any) => {
                console.log(err);
                res.status(500).send({
                    error: "Could not add product to cart"
                })
            })
        } else {
            //if not found then create new entry in cart table set quantity to 1
            getPrice(req.body.productId).then((price) => {
                var user:User=req.body.user;
                _Cart.create({
                    productId: req.body.productId,
                    amount: price,
                    quantity: 1,
                    userId:user.id
                }).then((cart) => {
                    res.status(201).send(cart);
                }).catch((err) => {
                    console.log(err)
                    res.status(501).send({
                        error: 'Could Not add new Product'
                    })
                })
            });
        }
    }).catch((err) => {
        res.status(500).send({
            error: "Error while adding product to cart"
        })
    })


})

//update quantity of cart entry comes here
route.put('/', (req:Request, res) => {

    if (!req.user) {
        return res.status(403).send({
           error: 'Please login before updating cart'
         })
     }
    //find item in cart with the same product id as comes in request
    _Cart.find({
        where: {
            productId: req.body.productId,
            userId:req.user.id
        },
        include: [{
            model: _Product
        }]
    }).then((item:any) => {
        console.log(item)
        //if flag true then increment otherwise decrement
        var flag;
        //check if type of increase in body of request is string 
        if (typeof req.body.increase == 'string') {
            flag = (req.body.increase == 'true');
        }
        else {
            flag = req.body.increase;
        }
        //flag true
        if (flag) {
            item.set('quantity', item.quantity + 1);
            item.set('amount', item.amount + item.product.price)
            item.save().then(() => {
                getCart(req).then((cart) => {
                    res.status(200).json(cart)
                }).catch((err) => {
                    console.log(err)
                    res.status(500).send({
                        error: "Could not update item in cart"
                    })
                });
            }).catch((err:any) => {
                console.log(err);
                res.status(500).send({
                    error: "Could not update item in cart"
                })
            })
        }
        else {
            //if quantity 1 and request for decrease the delete item from cart and new cart array as json response
            if (item.quantity == 1) {
                _Cart.destroy({
                    where: {
                        id: item.id
                    }
                }).then(() => {
                    getCart(req).then((cart) => {
                        res.status(200).json(cart)
                    }).catch((err) => {
                        console.log(err)
                        res.status(500).send({
                            error: "Could not update item in cart"
                        })
                    });

                }).catch((err) => {
                    console.log(err)
                    res.status(500).send({
                        error: "could not delete item from cart"
                    })
                })
            }
            else {
                //if quantity more than 1
                item.set('quantity', item.quantity - 1);
                item.set('amount', item.amount - item.product.price)
                item.save().then(() => {
                    getCart(req).then((cart) => {
                        res.status(200).json(cart)
                    }).catch((err) => {
                        console.log(err)
                        res.status(500).send({
                            error: "Could not update item in cart"
                        })
                    });
                }).catch((err:any) => {
                    console.log(err);
                    res.status(500).send({
                        error: "Could not update item in cart"
                    })
                })
            }
        }
    }).catch((err:any) => {
        console.log(err)
        res.status(500).send({
            error: "Could not update item in cart"
        })
    })
})

//get price of product
async function getPrice(i:number) {
    var product:any = await _Product.findOne({
        where: {
            id: i
        }
    }).catch((err) => console.log(err));
    return product.price;
}


//get cart from cart table
async function getCart(req:any) {
    console.log(req.user.id)
    var cart:Cart[] = await _Cart.findAll({
        where:{
           userId:req.user.id
        },
        include: [{
            model: _Product
            
        }]
    })
    return cart;
}

//export route
export default route;