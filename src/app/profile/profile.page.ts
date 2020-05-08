import { Component, OnInit } from '@angular/core';
import { User } from 'models/user';
import { AuthService } from '../services/auth.service';
import {Storage} from '@ionic/storage';
import { LoadingController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { Address } from 'models/address';




@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  user:User={} as User; 
  address:Address={} as Address;
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';
  usersRef = firebase.database().ref('users');
  data:any[];
  constructor(private as:AuthService, private s:Storage,private ld:LoadingController,private router:Router,
    private alertController:AlertController) { 
   
  }

  ngOnInit() {

    
    
      
  }
  ionViewWillEnter(){
    this.s.get('auth-token').then((user)=>{
      
      this.user=user;
      this.address=this.user.address;
      console.log(this.user);
      
    }).then(()=>{
      console.log(this.address);
    });
   
  }
  async savechanges(){
      const load=await this.ld.create({
        message: "saving..",
        spinner:"circular"
      })
      load.present();
      if(this.user.email==undefined)
        this.user.email="";
      if(this.user.displayName==undefined)    
        this.user.displayName="";
      
        
      this.user.address=this.address;
      setTimeout(()=>{
        var user=firebase.auth().currentUser;      
        this.usersRef.child(user.uid).update({
          displayName:this.user.displayName,  
          email:this.user.email,
          phoneNumber:this.user.phoneNumber,
          address:this.address,
          
      }).then((result)=>{console.log("data uploaded successfully..");}).catch((err)=>{console.log("not uploaded "+err)});
      setTimeout(async ()=>{
        this.as.update(this.user);
        this.router.navigate(['/tabs/tab2'])
        const alert = await this.alertController.create({
          header: '',
          message: 'saved succcessfully',
          buttons: ['OK']
        });
        alert.present();
        load.dismiss();
      },1000);
       
        
        
        load.dismiss();
      },1000)
  }

  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
}

}
