import { Component, OnInit, Input } from '@angular/core';

import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import * as firebase from 'firebase';

import { AuthService } from '../services/auth.service';
import { User } from 'models/user';
import { Router } from '@angular/router';
@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.page.html',
  styleUrls: ['./add-address.page.scss'],
})
export class AddAddressPage implements OnInit {
 
    @Input() User:User;
    constructor(private as:AuthService,private modal:ModalController,private storage:Storage,private router:Router) { }
    
    ngOnInit() {
 
    }
    
    save(){
      console.log(this.User.address);
      this.storage.get('auth-token').then((data)=>{
        firebase.database().ref('users').child(data.uid).update({
            displayName:this.User.displayName,
            address:this.User.address
        }).then(()=>{
          
          this.as.update(this.User);
          console.log("dismissed")
          console.log(this.User);
          
          this.modal.dismiss();
        })
      })
        
    }
  cancel(){
    this.modal.dismiss();
  }
}
