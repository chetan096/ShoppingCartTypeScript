/// <reference types="express" />
import { Router } from 'express';
declare const route: Router;
export declare class Product {
    id: number;
    name: string;
    price: number;
    constructor(id: number, name: string, price: number);
}
export default route;
