import { Component } from '@angular/core';
import {Item} from 'models/item';
import { StorageService } from '../services/storage.service';
import {Storage} from '@ionic/storage';
import * as firebase from 'firebase';
import { AuthService } from '../services/auth.service';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  Products:Item[]=[];
  
  usersRef=firebase.database().ref('users');
  itemsRef=firebase.database().ref('items');
  constructor(private ss:StorageService,private storage:Storage,private as:AuthService,private load:LoadingController,private router:Router) {
      
    
  }

ngOnInit(){
  
  

}
organicVegetable(){
  this.router.navigate(['tabs/categories/',"organic vegetable"]);
}
organicFruit(){
this.router.navigate(['tabs/categories/',"organic fruit"]);
}
organicGroceries(){
  this.router.navigate(['tabs/categories/',"organic grocery"]);
}


ionViewDidEnter(){

   
    var tem:Item[]=[]
    this.Products=[];
    this.load.create({  
      spinner:null,
      backdropDismiss:false,
      cssClass:'myclass',
      message: `<div class="spinner-grow text-success" role="status" >
      <span class="sr-only">Loading...</span>
    </div>`,
    
    duration:5000
    }).then((loading)=>{
  
    loading.present();
    this.storage.get('auth-token').then((data)=>{
      this.usersRef.child(data.uid).orderByValue().once("value",x=>{
        if(x.val().cart!=undefined){
          this.Products=(x.val().cart)
          this.storage.set('ITEMS',this.Products);
        }
        
        
    }).then(()=>{
      loading.dismiss();
    })
   
    })
  });
      
     
  }


  
  
}
