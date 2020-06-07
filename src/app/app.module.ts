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
import { OurstoryComponent } from './ourstory/ourstory.component';
import { ReviewsComponent } from './reviews/reviews.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [AppComponent,AddAddressPage,ChangepassComponent,OurstoryComponent,ReviewsComponent],
  entryComponents: [ChangepassComponent,AddAddressPage,OurstoryComponent,ReviewsComponent],
  imports: [BrowserModule, IonicModule.forRoot(),
  AppRoutingModule,
  FormsModule,
  ReactiveFormsModule,
  IonicModule.forRoot(),
  IonicStorageModule.forRoot(),
  MDBBootstrapModule.forRoot(),
  ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    
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

