export class Item{
    name:string;
    cost:string;
    amount:string;
    qty:number=0;
    imgUrl:string;
    category:string;
    timestamp:string;
    orderedTimestamp?:string;
    deliveredTimestamp?:string;
    delivered?:boolean;
    state?:boolean;
}