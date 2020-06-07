import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { Item } from 'models/item';
import { Storage } from '@ionic/storage';
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.page.html',
  styleUrls: ['./my-orders.page.scss'],
})
export class MyOrdersPage implements OnInit {
  usersRef=firebase.database().ref('users/');
  mode:string="";
  items:Item[]=[];
  totalvalue=0;
  displayMsg="";
  pretotal=0;
  constructor(private storage:Storage,private alertCtrl:AlertController) { }

  ngOnInit() {
    
  }
  ionViewWillEnter(){
    this.totalvalue=0;
    this.storage.get('auth-token').then((data)=>{
      this.usersRef.child(data.uid).on('value',da=>{
        this.items=da.val().confirmedOrders;
        this.mode=da.val().paymentMode;
        if(this.mode==undefined)
          this.mode=""
        if(this.items==undefined)
            this.displayMsg="No Orders Yet!!!"
        else{
        this.items.forEach((x)=>{
          if(!x.delivered)
            this.totalvalue+=(x.qty*Number(x.cost)*x.subqty);
          else{
            this.pretotal+=(x.qty*Number(x.cost)*x.subqty)
          }
        })
        
        this.items.reverse();   }    
        
     })   
    })    
  }

}
