/// <reference types="express" />
import { Router } from 'express';
declare const route: Router;
export declare class Vendor {
    id: number;
    name: string;
    constructor(id: number, name: string);
}
export default route;
