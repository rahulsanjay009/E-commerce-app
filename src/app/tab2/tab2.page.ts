import { Component } from '@angular/core';
import {Storage} from '@ionic/storage';
import {ModalController} from '@ionic/angular';
import { User } from 'models/user';
import {LoadingController,AlertController} from '@ionic/angular';
import {GooglePlus} from '@ionic-native/google-plus/ngx';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

import * as firebase from 'firebase';
import { ChangepassComponent } from '../changepass/changepass.component';
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  user : User={} as User;
  usersRef = firebase.database().ref('users/');
  state:Boolean=false;
  temp:User[]=[];
  constructor(private router:Router,private modal:ModalController,private ld:LoadingController,private s:Storage,
    private gplus:GooglePlus,private as:AuthService,private alertController:AlertController,private storage:Storage) {
    this.as.authstate.subscribe(state=>{
      if(!state)
        this.router.navigate(['/']);  
    })
  }
  ngOnInit(){
   
  }
  ionViewDidEnter(){
    this.as.authstate.subscribe((s)=>{
      this.state=s;
    })
    this.storage.get('auth-token').then((data)=>{
          if(data==null)  
              this.router.navigate(['start']);
          else{
              this.user=data;
              
          }    
    })
  }

async logout(){
  const load=await this.ld.create({
    message:"logging out...",
    spinner:"circular"
  });
  await load.present();
    this.as.logout();
    this.storage.remove('ITEMS');
    this.as.authstate.subscribe((state)=>{
      this.state=state;
    })
    
    firebase.auth().signOut().then((res)=>{
      setTimeout(async ()=>{
        this.router.navigate(['/start']);
        this.as.logout();
        
        const alert = await this.alertController.create({
          header: '',
          message: 'Logged out succcessfully',
          buttons: ['OK']
        });
        await alert.present();
        load.dismiss();
      },1000);
        
    })
    
  }
  changepass(){
      this.modal.create({
        component:ChangepassComponent}).then((ref)=>{
            ref.present();
        })
      
  }

}
