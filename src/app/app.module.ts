import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import {GooglePlus} from '@ionic-native/google-plus/ngx';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {FirebaseAuthentication} from '@ionic-native/firebase-authentication/ngx';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {MDBBootstrapModule} from 'angular-bootstrap-md';
import { IonicStorageModule } from '@ionic/storage';
import { AddAddressPage } from './add-address/add-address.page';
import { ChangepassComponent } from './changepass/changepass.component';
import {CallNumber} from '@ionic-native/call-number/ngx';

@NgModule({
  declarations: [AppComponent,AddAddressPage,ChangepassComponent],
  entryComponents: [ChangepassComponent,AddAddressPage],
  imports: [BrowserModule, IonicModule.forRoot(),
  AppRoutingModule,
  FormsModule,
  ReactiveFormsModule,
  IonicModule.forRoot(),
  IonicStorageModule.forRoot(),
  MDBBootstrapModule.forRoot(),
    
],
  providers: [
    StatusBar,
    GooglePlus,
    SplashScreen,
    FirebaseAuthentication,
    CallNumber,

    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  
  bootstrap: [AppComponent]
})
export class AppModule {}

