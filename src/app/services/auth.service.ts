import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { User } from 'models/user';
import { BehaviorSubject } from 'rxjs';
import { Platform } from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';

const TOKEN_KEY='auth-token';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authstate = new BehaviorSubject(false);
  constructor(private storage:Storage,private plt:Platform,private splashScreen:SplashScreen) { 
     this.plt.ready().then(()=>{
        
        this.checkToken();
        this.splashScreen.hide();
     })
  }

  get windowRef(){
    return window;
  }
  login(user:User){
      return this.storage.set(TOKEN_KEY,user).then((res)=>{
        this.authstate.next(true);
        console.log("Why did u called me....");
        
      })
  }
  update(user:User){
    return this.storage.set(TOKEN_KEY,user).then((res)=>{
        console.log("U called me??")
    })
  }
  logout(){
    return this.storage.remove(TOKEN_KEY).then((res)=>{
      this.authstate.next(false);
    })
  }
  isAuth(){
      return this.authstate.value;
  }
  checkToken(){
    return this.storage.get(TOKEN_KEY).then((res)=>{
      if(res){
        this.authstate.next(true);
      
      }
     
        
    })
  }
  getUser():User{
      var temp;
      this.storage.get(TOKEN_KEY).then((data)=>{
          temp=data;
      })
      return temp;
  }
  
}
