import { Component, OnInit } from '@angular/core';
import {User} from 'models/user';
import {LoadingController, AlertController} from '@ionic/angular';
import * as firebase from 'firebase';

import {Router} from '@angular/router';
import { AuthService } from '../services/auth.service';

import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { environment } from 'src/environments/environment';
import { Storage } from '@ionic/storage';



@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
})
export class StartPage implements OnInit {
  variable:boolean=true;
  windowRef:any;
  user:User={} as User;
  check:boolean=true;
  verificationCode:any;
  phone:string='';
  code:number;
  usersRef = firebase.database().ref('users');


  constructor(private ld:LoadingController,private as:AuthService,private router:Router,private splashScreen: SplashScreen,
    private alertController:AlertController,private storage:Storage) { 
        
  }
 
  ngOnInit() {
    this.splashScreen.hide();
      this.windowRef=this.as.windowRef;
      this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
        'size': 'invisible',
        'callback': function(response) {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          
        },
        
      });
    
  }
  ionViewDidEnter(){
    this.as.authstate.subscribe((state)=>{
        if(state){
            this.router.navigate(['/tabs/tab1']);
        }
    })
  }
 async sendotp(){
  let phone:string=this.phone;
  const load=await this.ld.create({
    message:"please wait...",
    spinner:"circular"
  });
   let  pass="+91"+phone;
    load.present();
  let appverifier=this.windowRef.recaptchaVerifier;
  firebase.auth().signInWithPhoneNumber(pass,appverifier).then((result)=>{
    this.windowRef.confirmationResult=result;
    this.variable=false;
    setTimeout(async ()=>{
      
      const alert = await this.alertController.create({
        header: '',
        message: 'OTP generated ',
        buttons: ['OK']
      });
      await alert.present();
      load.dismiss();
    });
  }).catch((err)=>{  
    this.alertController.create({
      header: '',
      message: 'Please check the number and try Again',
      buttons: ['OK']
    }).then((l)=>{
      l.present();
      load.dismiss();
    });
    
  }).finally(()=>{ load.dismiss();})




  }

  async verify(phone){
    const load=await this.ld.create({
      message:"please wait...",
      spinner:"circular"
    });
    
    load.present();
    if(this.code==null)
        load.dismiss();

    this.windowRef.confirmationResult.confirm(this.code).then((result)=>{
    
      this.user.displayName = result.user.displayName;
      this.user.uid=result.user.uid;
      this.user.email = result.user.email;
      this.user.phoneNumber=result.user.phoneNumber;
      
      this.user.address={FNO:'',street1:'',street2:'',city:'',pincode:'',location:''}
      this.user.confirmedOrders=[];

      this.usersRef.child(this.user.uid).once("value",data=>{

        var val=data.val();
        
        if(val!=null){
        
        this.user.displayName=val.displayName,
        this.user.email=val.email;
        if(this.user.address.FNO!=undefined||this.user.address.street1!=undefined||this.user.address.street2!=undefined||this.user.address.city!=undefined||this.user.address.pincode!=undefined||this.user.address.location!=undefined)
            this.user.address=val.address;
        if(this.user.confirmedOrders!=undefined)
            this.user.confirmedOrders=val.confirmedOrders;        
      }
      else{
       this.usersRef.child(this.user.uid).update({
          uid:this.user.uid,
          displayName:this.user.displayName,
          email:this.user.email,
          phoneNumber:this.user.phoneNumber,
          address:this.user.address,
          
          confirmedOrders:this.user.confirmedOrders
      }).then((result)=>{
        
      }).catch((err)=>{
        load.present();
        alert("Failed verification  "); 
      });
    }
    this.storage.remove('ITEMS');
    this.as.login(this.user).then(()=>{
      
      this.router.navigate(['tabs']);
    });
    
    
    
      
    }); 
      
       
        
      
    }).catch((err)=>{ load.dismiss(); 
      this.alertController.create({
        header: '',
        message: 'Incorrect otp',
        buttons: ['OK']
      }).then((l)=>{
        l.present();
      });
       
      }).finally(()=>{load.dismiss()});
   

  } 



}
