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
  payment:string=null;
  displayMsg='';
  totalvalue:number=0;
  state:boolean=false;
  size=[0.25,0.5,0.75,1,1.5,2,2.5,3,3.5,4,4.5,5];
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
            
            
            
            if(this.items==undefined){
                this.displayMsg='Your cart is empty';
                this.state=false;
              }
            else{
              this.state=true;
            this.items.forEach((x)=>{
              firebase.database().ref('items').child(x.name).on("value",(y)=>{
                x.cost=y.val().cost;
                this.totalvalue=0;
                this.items.forEach((j)=>{
                  this.totalvalue+=Number(j.cost)*j.qty*j.subqty;
                })                
                
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
    var totalVal=0;
    this.items.forEach((data)=>{
      data.orderedTimestamp=date;
      data.delivered=false;
      totalVal+=Number(data.cost)*data.qty*data.subqty;
      firebase.database().ref('items').child(data.name).on("value",(da)=>{
          data.cost=da.val().cost;
          
      })

    })
    if(totalVal<200){
        this.alertController.create({
          message:"Your order is below Rs. 200/-",
        }).then((da)=>{ da.present()});
    }
    else if(this.payment==null){
      this.alertController.create({
        message:"Please Select a Payment Mode!",
      }).then((da)=>{ da.present()});
    }
    else{
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
          
          this.temp.push(...this.items);
       }).then(()=>{            
        
        if(user.address.FNO==''||user.address.street1==''||user.address.street2==''||user.address.city==''||user.address.pincode==''||user.address.location==undefined){
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
        
        
          
            
            this.items.forEach((i)=>{
              
              var q;
              if(!i.delivered){
                firebase.database().ref('items').child(i.name).once('value',(d)=>{
                  if(d.val().quantity==undefined){
                        q=i.qty*i.subqty;
                        firebase.database().ref('items').child(i.name).update({
                          quantity:q
                        })
                  }
                  else{
                    q=(i.qty*i.subqty)+d.val().quantity;
                    firebase.database().ref('items').child(i.name).update({
                      quantity:q
                    })
                  }
                })
              }
            })
       
                    
                this.usersRef.child(user.uid).update({
                  confirmedOrders: this.temp,
                  cart:[],
                  paymentMode:this.payment
                }).then((res)=>{
                  this.storage.remove('ITEMS');
                  this.items=[];
                  }).catch((err)=>{console.log(err)});
                
                this.temp=[];
                this.ss.confirmed();
                this.payment=null;
                this.storage.remove('ITEMS');
                Loading.dismiss();
                this.router.navigate(['/myorders']);
                setTimeout(async ()=>{
                  
                  const alert = await this.alertController.create({
                    
                    message: 'Order Confirmed !... Your Order will be delivered Shortly...',
                    buttons: ['OK'],
                    
                  });
                  
                  await alert.present();
                },100) 
              
              
              }
            });
        });
       });  
    }
  }


  dqty(item){
    this.totalvalue=this.totalvalue-Number(item.cost)*item.subqty;
    if(item.subqty-0.25 < 0.25&&item.amount.split(' ')[1].toLowerCase()=='kg'){
      item.qty = 0;
      item.subqty=this.size[3];
      
      console.log('item_1->' + item.qty)
      firebase.database().ref('users').child(this.uid).once("value",data=>{
        let x=[];
        x=data.val().cart;
        x=x.filter((i)=>{
          if(i.name!=item.name)
            return x;
        })
        this.items=x;
        firebase.database().ref('users').child(this.uid).update({
          cart:x
        })  
    })    
      
    }
    else if(item.amount.split(' ')[1].toLowerCase()!='kg'&&item.subqty-1<1){
      item.qty = 0;
      item.subqty=this.size[3];
      firebase.database().ref('users').child(this.uid).once("value",data=>{
        let x=[];
        x=data.val().cart;
        x=x.filter((i)=>{
          if(i.name!=item.name)
            return x;
        })
        this.items=x;
        firebase.database().ref('users').child(this.uid).update({
          cart:x
        })  
      });
    }
    else{
      if(item.amount.split(' ')[1].toLowerCase()=='kg'){
        item.qty=1;
        item.subqty=this.size[this.size.indexOf(item.subqty)-1];
    }
    else{
      item.qty=1;
      item.subqty--;
    }
    firebase.database().ref('users').child(this.uid).once("value",data=>{
      let x=[];
      x=data.val().cart;
      x.map((i)=>{
        if(i.name==item.name){
          i.name=item.name;
          i.qty=item.qty;
          i.subqty=item.subqty;
        }
      })
        firebase.database().ref('users').child(this.uid).update({
          cart:x
        })  
      })
    } 
	this.totalvalue=this.totalvalue+Number(item.cost)*item.subqty;
}

iqty(item){
  this.totalvalue=this.totalvalue-Number(item.cost)*item.subqty;
  if(item.qty==0){
      if(item.amount.split(' ')[1].toLowerCase()=='kg'){
        item.qty=1;
        item.subqty=this.size[this.size.indexOf(item.subqty)];
      }
      else{
        item.subqty=1;
        item.qty=1;
      }        
        firebase.database().ref('users').child(this.uid).once("value",data=>{
            let x=[];
            x=data.val().cart;
            if(x==undefined)
              x=[];
            x.push(item);
            firebase.database().ref('users').child(this.uid).update({
              cart:x
            })  
        })    
    }
  else{
  if(item.amount.split(' ')[1].toLowerCase()=='kg'){
    item.qty=1;
    if(item.subqty==5)
        item.subqty=this.size[this.size.length-1];
    else
      item.subqty=this.size[this.size.indexOf(item.subqty)+1];
  }
  else{
    item.qty=1;
    item.subqty++; 
  }
  firebase.database().ref('users').child(this.uid).once("value",data=>{
    let x=[];
    
    if(data.val().cart!=undefined)
      { 
          x=data.val().cart;
          x.map((i)=>{
            if(i.name==item.name){
              i.name=item.name;
              i.qty=item.qty;
              i.subqty=item.subqty;
            }
          })
      }
      else{
          x.push(item);
      }
      firebase.database().ref('users').child(this.uid).update({
        cart:x
      })  
    })
  }  
this.totalvalue=this.totalvalue+Number(item.cost)*item.subqty;
}


optionsFn(event){
 this.payment=event.target.value; 
}
change(ref,item:Item){
  
  item.subqty=ref;
  if(item.qty>0)
      this.ss.updateItem(item,'ITEMS').then(()=>{
        var x;
        this.ss.getItems('ITEMS').then((data)=>{
          x=data;
          this.storage.get('auth-token').then((data)=>{
            firebase.database().ref('users').child(data.uid).update({
                  cart:x
            }).then(()=>{
                this.totalvalue=0
              this.items.forEach((data)=>{
                this.totalvalue+=Number(data.cost)*data.qty*data.subqty;});
            })
          })
       })
      })  
  }
  rmve(item){
    let x=[];
    
    firebase.database().ref('users').child(this.uid).once("value",data=>{
      
      x=data.val().cart;
      x=x.filter((i)=>{
        if(i.name!=item.name)
          return x;
      })
      firebase.database().ref('users').child(this.uid).update({
        cart:x
      })  
    }).then(()=>{
      item.qty=0;
      item.subqty=1;  
      this.items=x;
      this.totalvalue=0;
      this.items.forEach((j)=>{
          this.totalvalue+=Number(j.cost)*j.qty*j.subqty;})
      })    
    }
}
