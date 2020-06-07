import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import * as firebase from 'firebase';
import { User } from 'models/user';
import { Storage } from '@ionic/storage';
interface Review{
    review:string;
    username:string;
}
@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss'],
})
export class ReviewsComponent implements OnInit {
  review:string=""
  reviews:Review[]=[];
  uid=firebase.auth().currentUser.uid;
  user:User;
  constructor(private modalCtrl:ModalController,private storage:Storage) { }

  ngOnInit() {

  }
  ionViewWillEnter(){
        this.initialize();
  }
  initialize(){
      this.reviews=[];
      firebase.database().ref('reviews').on("child_added",(da)=>{
          this.reviews.push(da.val())
      })
  }
  submit(){
      this.storage.get('auth-token').then((da)=>{
          this.user=da;
      }).then(()=>{
        firebase.database().ref('reviews').child(this.uid).update({
          review:this.review,
          username:this.user.displayName,
          phoneNumber:this.user.phoneNumber,
          uid:this.uid
          }).then(()=>{
              this.initialize();
              this.review=''
          })
      })
      
  }
  close(){
      this.modalCtrl.dismiss()
  }
}
