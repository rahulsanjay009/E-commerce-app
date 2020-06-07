import {Item} from './item';
import { Address } from './address';
export class User{
        displayName?:string;
        email? :string;        
        address?:Address;
        phoneNumber:string;
        imageUrl ?:string;
        cart?:Item[];
        uid?:string;
        confirmedOrders?:Item[];
        wishlist?:string[];
        paymentMode?:string;
}