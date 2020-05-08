import { Component, OnInit } from '@angular/core';
import {CallNumber} from '@ionic-native/call-number/ngx';
@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.page.html',
  styleUrls: ['./contact-us.page.scss'],
})
export class ContactUsPage implements OnInit {

  constructor(private callNumber:CallNumber) { }

  ngOnInit() {
  }
call(){
  this.callNumber.callNumber('9985960449',true).then(()=>{
    console.log("call initiated");
  })
}
}
