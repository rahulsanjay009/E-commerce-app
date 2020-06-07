import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-ourstory',
  templateUrl: './ourstory.component.html',
  styleUrls: ['./ourstory.component.scss'],
})
export class OurstoryComponent implements OnInit {

  constructor(private modalCtrl:ModalController) { }

  ngOnInit() {}
  close(){
    this.modalCtrl.dismiss();
  }
}
