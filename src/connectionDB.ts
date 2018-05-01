// file creates tables and make connection with the database
//const Sequelize = require('sequelize')
import Sequelize from 'sequelize'
import {Vendor} from './routes/api/vendors'
import {User} from './routes/api/users'
import {Product} from './routes/api/products'
import {Cart} from './routes/api/cart';

const db = new Sequelize('ngrwsdb', 'ngrusr', 'ngrpass', {
  dialect: 'mysql',
  host: 'localhost',
  // rest are optional
  port: 3306,
  // it means all the time at least one connection will be maintained if more request comes then at most 5 connection can be created
  pool: {
    max: 5, // max 5 connection
    min: 1, // min 1 connection
    idle: 1000 // create connection after this timeout
  },
  // metadata information regarding queries
  // create custom function if you want to store logs in other file
  logging: console.log
})


export const _User=db.define<User,any>('user',{
  username:{
      type:Sequelize.STRING,
      unique:true,
      allowNull:false
  },
  password:{
      type:Sequelize.STRING,
      allowNull:false
  }
})



// Product table having id,name,price field and vendorId refernces  the vendor
export const _Product = db.define<Product,any>('products', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  price: {
    type: Sequelize.FLOAT,
    allowNull: false,
    defaultValue: 0.0
  }
})

// Vendor table fields are id a primary key acts as a foriegn key in product table and name
export const _Vendor = db.define<Vendor,any>('vendors', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  }
})

// Cart fields are id,quantity of the selected product,amount i.e price*quantity and productId references ProductId of Product Table
export const _Cart = db.define<Cart,any>('carts', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  quantity: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  amount: {
    type: Sequelize.FLOAT,
    defaultValue: 0.0
  }

})

// Vendor Product mapping creates a vendorId field in Product Table
_Vendor.hasMany(_Product)
_Product.belongsTo(_Vendor)
// Product Cart mapping creates productId field in the Cart Table
_Product.hasMany(_Cart)
_Cart.belongsTo(_Product)

_Cart.belongsTo(_User)

// make connection with the database and creates tables
db.sync().then(() => console.log('Database synced')).catch((err) => console.log('Error creating database'))

// // exporting created table instances
// exports = module.exports = {
// Product,Vendor,Cart,User
// }
