import { Component } from '@angular/core';
import {AuthService} from './services/auth.service';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import {environment} from 'src/environments/environment';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private as:AuthService,
    private router:Router,
    
  ) {
    this.initializeApp();
   
  }

  initializeApp() {
    firebase.initializeApp(environment.config);
    
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();       
      this.as.authstate.subscribe((state)=>{
        if(state)
          this.router.navigate(['']);
        else
          this.router.navigate(['/start']);  
           
    })
    });  
  }
}
