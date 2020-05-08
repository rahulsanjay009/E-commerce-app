import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { Storage } from '@ionic/storage';
import * as firebase from 'firebase';
import { LoadingController } from '@ionic/angular';
import { Item } from 'models/item';

@Component({
  selector: 'app-show-content',
  templateUrl: './show-content.page.html',
  styleUrls: ['./show-content.page.scss'],
})
export class ShowContentPage implements OnInit {
  category:string;
  Products:Item[]=[];
  filtered:Item[]=[];
  displayMsg='';
  itemname='';
  uid=firebase.auth().currentUser.uid;
  constructor(private ss:StorageService,private storage:Storage,
    private load:LoadingController,private route:ActivatedRoute) {
        
    
  }

ngOnInit(){
  
  

}
  ionViewDidEnter(){
    
  this.category=this.route.snapshot.paramMap.get('id');
  
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
      firebase.database().ref('users').child(data.uid).orderByValue().once("value",x=>{
        if(x.val().cart!=undefined){
          this.Products=(x.val().cart)
          
          
          this.storage.set('ITEMS',this.Products);
        }
     
    }).then(()=>{ 
        
       firebase.database().ref('items').orderByValue().once("value",da=>{
          
            da.forEach((da)=>{
              if(da.val().category==this.category)
                  tem.push(da.val())
            })
            for(let i of this.Products)
              for(let j of tem){
                 if(i.name==j.name){
                    j.qty=i.qty;
                    break;
                  }
            } 
           this.Products=tem;
           this.displayMsg=this.category.split(" ")[1]+"s will be availabe soon!!!"
           loading.dismiss();
        })
           
        
    })
   
    })
  });
      
       
      if(!this.ss.x){
        this.Products.forEach((item)=>{
            item.qty=0;
        })
        this.ss.confirmed();
      }
  }
  dqty(item){
      if(item.qty-1 < 1){
        item.qty = 0;
        var x;
        console.log('item_1->' + item.qty)
        this.ss.deleteItem(item,'ITEMS').then((da)=>{
          console.log('dqty..')
          
        }).then(()=>{
          this.ss.getItems('ITEMS').then((data)=>{
            x=data;
            this.storage.get('auth-token').then((data)=>{
              firebase.database().ref('users').child(data.uid).update({
                    cart:x
              })
            })
         })
        });
        
      }
      else{
        item.qty -= 1;
        var x;
        console.log('item_2->' + item.qty);
        this.ss.updateItem(item,'ITEMS').then((da)=>{
          console.log('dqty...')
        }).then(()=>{
          this.ss.getItems('ITEMS').then((data)=>{
            x=data;
            this.storage.get('auth-token').then((data)=>{
              firebase.database().ref('users').child(data.uid).update({
                    cart:x
              })
            })
         })
        });
       
      } 
  }

  iqty(item){
    if(item.qty==0){
        item.qty=1;
        this.ss.addItem(item,'ITEMS').then(()=>{
          this.ss.getItems('ITEMS').then((data)=>{
            x=data;
            this.storage.get('auth-token').then((data)=>{
              firebase.database().ref('users').child(data.uid).update({
                    cart:x
              })
            })
         })
        });
        
      }
    else{
    item.qty+=1;
    var x;
    this.ss.updateItem(item,'ITEMS').then((data)=>{
      console.log("iqty..");  
      this.ss.getItems('ITEMS').then((data)=>{
        
      })
    }).then(()=>{
      this.ss.getItems('ITEMS').then((data)=>{
        x=data;
        this.storage.get('auth-token').then((data)=>{
          firebase.database().ref('users').child(data.uid).update({
                cart:x
          })
        })
     })
    });
    }  
  }


FilterData(event:any){
   this.filtered=[];
    const val=event.target.value;
    if(val&&val.trim()!=''){
        this.filtered=this.Products.filter((i)=>{
            return i.name.toLowerCase().indexOf(val.toLowerCase())>-1;

        })
    }
    
  }



}


