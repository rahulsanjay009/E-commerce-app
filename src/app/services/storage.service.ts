import { Injectable } from '@angular/core';

import {Storage} from '@ionic/storage';
import { Item } from 'models/item';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  x=true;
 
  constructor(private storage:Storage) { }
  addItem(item:Item,ITEMS_KEY:string):Promise<any>{
      return this.storage.get(ITEMS_KEY).then((items:Item[])=>{
          if(items){
              items.push(item); 
              return this.storage.set(ITEMS_KEY,items);
          }
          else{
              return this.storage.set(ITEMS_KEY,[item]);
          }
      });
  }
  addItems(item:Item[],ITEMS_KEY:string):Promise<any>{
    return this.storage.get(ITEMS_KEY).then((items:Item[])=>{
        if(items){
            items.push(...item); 
            return this.storage.set(ITEMS_KEY,items);
        }
        else{
            return this.storage.set(ITEMS_KEY,[item]);
        }
    });
}
  getItems(ITEMS_KEY:string):Promise<Item[]>{
      return this.storage.get(ITEMS_KEY);
  }
  updateItem(item:Item,ITEMS_KEY:string):Promise<any>{
    return this.storage.get(ITEMS_KEY).then((items:Item[])=>{
      if(!items||items.length==0){
          return null;
      }
      let newItems:Item[]=[];
      for(let i of items){
        if(i.name== item.name){
          newItems.push(item);
        }
        else  
          newItems.push(i);
      }
      return this.storage.set(ITEMS_KEY,newItems);
  });
  
  }
  confirmed(){
      this.x=!this.x;
  }
  deleteItem(item:Item,ITEMS_KEY:string):Promise<any>{
    return this.storage.get(ITEMS_KEY).then((items:Item[])=>{
      if(!items||items.length===0){
          return null;
      }
      let newItems:Item[]=[];
      for(let i of items){
        if(i.name!== item.name){
          newItems.push(i);
        }
      }
      return this.storage.set(ITEMS_KEY,newItems);
  });
  }
 
}
