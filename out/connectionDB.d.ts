/// <reference types="sequelize" />
import Sequelize from 'sequelize';
import { Vendor } from './routes/api/vendors';
import { User } from './routes/api/users';
import { Product } from './routes/api/products';
import { Cart } from './routes/api/cart';
export declare const _User: Sequelize.Model<User, any>;
export declare const _Product: Sequelize.Model<Product, any>;
export declare const _Vendor: Sequelize.Model<Vendor, any>;
export declare const _Cart: Sequelize.Model<Cart, any>;
