//const route=require('express').Router();
import {Request,Router} from 'express';
const route:Router=Router();
import userRoute from './users';
import productRoute from './products';
import vendorRoute from './vendors';
import cartRoute from './cart';
const routes={
    userRoute,productRoute,vendorRoute,cartRoute
}

//will mount user.js export on this url
route.use('/users',routes.userRoute);
//will mount products.js exports on this url
route.use('/products',routes.productRoute);
//will mount vendors.js exports on this url
route.use('/vendors',routes.vendorRoute);
//will mount cart.js export on this url
route.use('/cart',routes.cartRoute);

//export this route
export default route