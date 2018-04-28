//get Cart table instance from connectionDB
const Cart = require('../../connectionDB').Cart;//current file->parent->parent folder->db.js
//middleware route for this file requests
const route = require('express').Router();
//Product Table instance
const Product = require('../../connectionDB').Product;

const User=require('../../connectionDB').User;

//get request for cart comes here
route.get('/', (req, res) => {
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
route.post('/', (req, res) => {

    if (!req.user) {
        return res.status(403).send({
           error: 'Please login before adding products to cart'
         })
       }
    //find cart entry for corresponding product id in cart table if no item then add new entry otherwise update quantity of that cart entry
    Cart.find({
        where: {
            productId: req.body.productId,
            userId:req.user.id
        },
        include: [{
            model: Product
        }]
    }).then((item) => {
        //if item found update quantity
        if (item != null) {
            item.set('quantity', item.quantity + 1);
            item.set('amount', item.amount + item.product.price)
            item.save().then((item) => {
                res.status(200).send(item);
            }).catch((err) => {
                console.log(err);
                res.status(500).send({
                    error: "Could not add product to cart"
                })
            })
        } else {
            //if not found then create new entry in cart table set quantity to 1
            getPrice(req.body.productId).then((price) => {
                Cart.create({
                    productId: req.body.productId,
                    amount: price,
                    quantity: 1,
                    userId:req.user.id
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
route.put('/', (req, res) => {

    if (!req.user) {
        return res.status(403).send({
           error: 'Please login before updating cart'
         })
     }
    //find item in cart with the same product id as comes in request
    Cart.find({
        where: {
            productId: req.body.productId,
            userId:req.user.id
        },
        include: [{
            model: Product,User
        }]
    }).then((item) => {
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
            }).catch((err) => {
                console.log(err);
                res.status(500).send({
                    error: "Could not update item in cart"
                })
            })
        }
        else {
            //if quantity 1 and request for decrease the delete item from cart and new cart array as json response
            if (item.quantity == 1) {
                Cart.destroy({
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
                }).catch((err) => {
                    console.log(err);
                    res.status(500).send({
                        error: "Could not update item in cart"
                    })
                })
            }
        }
    }).catch((err) => {
        res.status(500).send({
            error: "Could not update item in cart"
        })
    })
})

//get price of product
async function getPrice(i) {
    var product = await Product.findOne({
        where: {
            id: i
        }
    }).catch((err) => console.log(err));
    return product.price;
}

//get cart from cart table
async function getCart(req) {
    console.log(req.user.id)
    var cart = await Cart.findAll({
        where:{
           userId:req.user.id
        },
        include: [{
            model: Product,User
            
        }]
    })
    return cart;
}

//export route
exports = module.exports = route;