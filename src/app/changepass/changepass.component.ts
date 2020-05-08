import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import * as firebase from 'firebase';
import { Storage } from '@ionic/storage';
import { User } from 'models/user';
@Component({
  selector: 'app-changepass',
  templateUrl: './changepass.component.html',
  styleUrls: ['./changepass.component.scss'],
})
export class ChangepassComponent implements OnInit {
  uid=firebase.auth().currentUser.uid;
  user:User;
  prelist:string[]=[];
  displayMsg=""
  constructor(private modal:ModalController,private storage:Storage,private alertCtrl:AlertController) { }

  ngOnInit() {}
  ionViewDidEnter(){
    firebase.database().ref('users').child(this.uid).on("value",(dat)=>{
      this.user=dat.val();
      if(dat.val().wishlist!=undefined)
          this.prelist=dat.val().wishlist;
      else{
          this.displayMsg="Please add items you wish to have"
      }
  })
  }
 save(){ 
   let alert = this.alertCtrl.create({
    message: 'Add Item',
    inputs: [
      {
        name: 'itemname',
        placeholder: 'Add item you wish'
      }
    ],
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: data => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Add',
        handler: data => {
          if (data.itemname!="") {
            this.prelist.push(data.itemname);
            firebase.database().ref('users').child(this.uid).update({
              wishlist:this.prelist
            })
            // logged in!
          } else {
            // invalid login
            return false;
          }
        }
      }
    ]
  }).then((da)=>{
    da.present();
  });
  
}
  back(){
      this.modal.dismiss();

  }
}
