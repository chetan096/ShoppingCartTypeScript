const route=require('express').Router();
//will mount user.js export on this url
route.use('/users',require('./users'));
//will mount products.js exports on this url
route.use('/products',require('./products'));
//will mount vendors.js exports on this url
route.use('/vendors',require('./vendors'));
//will mount cart.js export on this url
route.use('/cart',require('./cart'));

//export this route
exports=module.exports=route