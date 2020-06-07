import { Component, OnInit } from '@angular/core';
import {CallNumber} from '@ionic-native/call-number/ngx';
import { ModalController } from '@ionic/angular';
import { OurstoryComponent } from '../ourstory/ourstory.component';
import { ReviewsComponent } from '../reviews/reviews.component';
@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.page.html',
  styleUrls: ['./contact-us.page.scss'],
})
export class ContactUsPage implements OnInit {

  constructor(private callNumber:CallNumber,private modalCtrl:ModalController) { }

  ngOnInit() {
  }
call(){
  this.callNumber.callNumber('9985960449',true).then(()=>{
    console.log("call initiated");
  })
}
aboutus(){
    this.modalCtrl.create({component:OurstoryComponent}).then((da)=>{
      da.present();
    })
}
reviews(){
  this.modalCtrl.create({component:ReviewsComponent}).then((da)=>{
    da.present();
  })
}

}
