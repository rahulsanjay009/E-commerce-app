import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShowContentPageRoutingModule } from './show-content-routing.module';

import { ShowContentPage } from './show-content.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShowContentPageRoutingModule
  ],
  declarations: [ShowContentPage]
})
export class ShowContentPageModule {}
