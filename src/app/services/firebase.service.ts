import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  userRef=firebase.database().ref('users');
  constructor() { }

  updateValue(id:string,value:any){
        this.userRef.child(id).update({
          cart:value
        }).then(()=>{
          this.userRef.off();
        })
  }
}
