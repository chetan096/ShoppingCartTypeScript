import {Router} from 'express';
// middleware route for this file
//const route = require('express').Router()
const route:Router=Router();

// get Vendor table reference from connectionDB 
//const Vendor = require('../../connectionDB').Vendor
import {_Vendor} from '../../connectionDB';

export class Vendor{
   public id:number;
   public name:string;
   constructor(id:number,name:string){
     this.id=id;
     this.name=name;
   }
}
// get vendors request comes here
route.get('/', (req, res) => {

  _Vendor.findAll().then((vendors:Vendor[]) => res.status(200).json(vendors)).catch((err:Error) => {
    res.status(500).send({
      error: 'Could not get Vendors'
    })
  })
})

export default route;
