import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShowContentPage } from './show-content.page';

const routes: Routes = [
  {
    path: '',
    component: ShowContentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShowContentPageRoutingModule {}
