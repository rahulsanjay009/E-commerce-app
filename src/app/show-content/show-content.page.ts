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
  category:string='';
  Products:Item[]=[];
  filtered:Item[]=[];
  val=["250g","500g","750g","1 kg","1.5 Kg","2 Kg","2.5 Kg","3 Kg","3.5 Kg","4 Kg","4.5 Kg","5 Kg"]
  size=[0.25,0.5,0.75,1,1.5,2,2.5,3,3.5,4,4.5,5];
  displayMsg='';
  itemname='';
  uid=firebase.auth().currentUser.uid;
  constructor(private ss:StorageService,private storage:Storage,private router:Router,
    private load:LoadingController,private route:ActivatedRoute) {
      this.category=this.route.snapshot.paramMap.get('id');
      
  
  }

ngOnInit(){
  
  this.category=this.route.snapshot.paramMap.get('id');
 

}
ionViewDidEnter(){
  this.initialize();
}
  initialize(){
    
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
                    j.subqty=i.subqty;
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
  }

  iqty(item){
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
      if(item.subqty>=5)
          item.subqty=this.size[0];
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
change(ref,item:Item){
  console.log(ref);
  item.subqty=ref;
  if(item.qty>0)
      this.ss.updateItem(item,'ITEMS').then(()=>{
        var x;
        this.ss.getItems('ITEMS').then((data)=>{
          x=data;
          this.storage.get('auth-token').then((data)=>{
            firebase.database().ref('users').child(data.uid).update({
                  cart:x
            })
          })
       })
      })
    
}

rmve(item){
  firebase.database().ref('users').child(this.uid).once("value",data=>{
    let x=[];
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
  });
}
Filter(l){
    if(l=='leafy'){
        this.filtered=this.Products.filter((x)=>{
            if(x.leafy=="true")
                return x;
        })
        
    }
    else if(l=='non-leafy'){
      this.filtered=this.Products.filter((x)=>{
        if(x.leafy=="false")
            return x;
      })
    }
    else{
      this.filtered=[];
    }
}
check(s):Boolean{
    if(s.split(' ')[1].toLowerCase()=='kg')
      return true;
    else  
      return false;  
  }
}


