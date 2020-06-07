export class Item{
    name:string;
    cost:string;
    amount:string;
    qty:number=0;
    subqty?:number;
    imgUrl:string;
    category:string;
    timestamp:string;
    orderedTimestamp?:string;
    deliveredTimestamp?:string;
    delivered?:boolean;
    state?:boolean;
    leafy?:string;
}