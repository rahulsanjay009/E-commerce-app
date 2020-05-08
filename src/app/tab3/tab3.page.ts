import { Component, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { Item } from 'models/item';
import * as firebase from 'firebase';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import {AlertController, LoadingController,ModalController } from '@ionic/angular';
import { Address } from 'models/address';
import { User } from 'models/user';
import { AddAddressPage } from '../add-address/add-address.page';


@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
})
export class Tab3Page implements OnInit {
  items:Item[]=[];
  displayMsg='';
  totalvalue:number=0;
  state:boolean=false;
  usersRef = firebase.database().ref('users');
  uid=firebase.auth().currentUser.uid;
  temp:Item[]=[];
  constructor(private ss:StorageService,private storage : Storage,private router:Router,private alertController:AlertController,
    private load:LoadingController,private modal:ModalController) { 

      
  }
  ionViewDidEnter(){
    this.totalvalue=0;

     this.load.create({  
        spinner:null,
        backdropDismiss:false,
        cssClass:'myclass',
        message: `<div class="spinner-grow text-success" role="status">
        <span class="sr-only">Loading...</span>
      </div>`,
      duration:3000
      }).then((loadi)=>{
        this.items=[];
        loadi.present();
      this.storage.get('auth-token').then((data)=>{
        firebase.database().ref('users').child(data.uid).orderByValue().once("value",(data)=>{
            this.items=data.val().cart
            console.log(this.items);
            
            
            if(this.items==undefined){
                this.displayMsg='Your cart is empty';
                this.state=false;
              }
            else{
              this.state=true;
            this.items.forEach((x)=>{
              firebase.database().ref('items').child(x.name).on("value",(y)=>{
                x.cost=y.val().cost;
                this.totalvalue+=Number(x.cost)*x.qty;
                console.log("function called....")
              })                
            })
          }
          loadi.dismiss()
          }).then(()=>{
            loadi.dismiss()
          })
      })
      
      });  
  }
  
  ngOnInit() {
      
      
   
  }
 
 
  confirm(){
    const utcDate1 = new Date(Date.now());
    this.temp=[];
    var date:string=utcDate1.toLocaleString("en-IN",{timeZone:'Asia/Kolkata'});
    this.items.forEach((data)=>{
      data.orderedTimestamp=date;
      data.delivered=false;
      firebase.database().ref('items').child(data.name).on("value",(da)=>{
          data.cost=da.val().cost;
          console.log(da.val().cost);
      })

    })
    
    this.load.create({  
      spinner:null,
      cssClass:'myclass',
      message: `<div class="spinner-grow text-success" role="status">
      <span class="sr-only">Loading...</span>
    </div>`,
    duration:5000
    }).then((Loading)=>{
        Loading.present();
    var add:Address={} as Address;
    var phne="";
    this.storage.get('auth-token').then((da)=>{
      var user:User=da;
     let ref= this.usersRef.child(da.uid).once("value", data=>{
        if(data.val().confirmedOrders!=undefined) 
          this.temp=data.val().confirmedOrders;
          add=data.val().address;
          phne=data.val().phoneNumber;
          console.log(this.items) ;
          this.temp.push(...this.items);
       }).then(()=>{            
        
        if(user.address.FNO==''||user.address.street1==''||user.address.street2==''||user.address.city==''||user.address.pincode==''){
        setTimeout(async ()=>{
          Loading.dismiss();
          const mod=await this.modal.create({
            component:AddAddressPage,
            componentProps:{
                User:user
            }
          })
        mod.present();
        })
      }
       else{
        
        
          this.storage.get('ITEMS').then((d)=>{
            
            d.forEach((i)=>{
              
              var q;
              firebase.database().ref('items').child(i.name).once('value',(d)=>{
                if(d.val().quantity==undefined){
                      q=i.qty;
                      firebase.database().ref('items').child(i.name).update({
                        quantity:q
                      })
                }
                else{
                  q=i.qty+d.val().quantity;
                  firebase.database().ref('items').child(i.name).update({
                    quantity:q
                  })
                }
              })
            })
         }).then(()=>{
                    
                this.usersRef.child(user.uid).update({
                  confirmedOrders: this.temp,
                  cart:[]
                }).then((res)=>{
                  this.storage.remove('ITEMS');
                  this.items=[];
                  console.log("confirmed " + res)}).catch((err)=>{console.log(err)});
                
                this.temp=[];
                this.ss.confirmed();
               
                Loading.dismiss();
                this.router.navigate(['/myorders']);
                setTimeout(async ()=>{
                  
                  const alert = await this.alertController.create({
                    
                    message: 'Order Confirmed !... Your Order will be delivered Shortly...',
                    buttons: ['OK'],
                    
                  });
                  
                  await alert.present();
                },100)  

         })     
        
       

       
       } 
      
      }) 
      })
    })     
   
  }

   dqty(item){
      if(item.qty-1 < 1){
        item.qty = 0;
        var x;
        console.log('item_1->' + item.qty)
        this.ss.deleteItem(item,'ITEMS').then((da)=>{
          console.log('dqty..');
          this.ss.getItems('ITEMS').then((dt)=>{
              this.items=dt;
          })
          this.totalvalue=this.totalvalue-Number(item.cost);
        })  
        
      }
      else{
        item.qty -= 1;
        var x;
        console.log('item_2->' + item.qty);
        firebase.database().ref('items').child(item.name).on("value",(k)=>{
            item.cost=k.val().cost;
            this.ss.updateItem(item,'ITEMS').then((da)=>{
              console.log('dqty...')
              this.totalvalue=this.totalvalue-Number(item.cost);
            })
        }) 
      } 
      
      
  }
ionViewWillLeave(){
  let x=[];
  this.ss.getItems('ITEMS').then((data)=>{
    x=data;
    this.storage.get('auth-token').then((data:User)=>{
      

      firebase.database().ref('users').child(data.uid).update({
                    
            cart:x
      }).then((res)=>{console.log("data set ", res)})
    }).then(()=>{ console.log("updated...")})
 })
}
  iqty(item){
    if(item.qty==0){
        item.qty=1;
        firebase.database().ref('items').child(item.name).on("value",(k)=>{
          item.cost=k.val().cost;
          this.ss.addItem(item,'ITEMS').then(()=>{
            this.totalvalue=this.totalvalue+Number(item.cost);
          });
      })
        
        
      }
    else{
    item.qty+=1;
    
    firebase.database().ref('items').child(item.name).on("value",(k)=>{
      item.cost=k.val().cost;
      this.ss.updateItem(item,'ITEMS').then((data)=>{
        console.log("iqty..");  
        this.totalvalue=this.totalvalue+Number(item.cost);
      })
  }) 
    
    
  } 

  }

  
}
