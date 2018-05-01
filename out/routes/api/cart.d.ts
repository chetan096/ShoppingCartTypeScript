/// <reference types="express" />
import { Router } from 'express';
declare const route: Router;
export declare class Cart {
    id: number;
    quantity: number;
    amount: number;
    constructor(id: number, quantity: number, amount: number);
}
export default route;
