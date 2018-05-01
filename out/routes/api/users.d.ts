/// <reference types="express" />
import { Router } from 'express';
declare const route: Router;
export declare class User {
    id: number;
    username: string;
    password: string;
    constructor(id: number, name: string, pass: string);
}
export default route;
