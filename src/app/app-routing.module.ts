import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';
import { LoginGuardService } from './services/login-guard.service';


const routes: Routes = [

  {
    path: '',
    canActivate:[AuthGuardService],
    loadChildren: () => import('./tabs/tabs.module').then( m => m.TabsPageModule)
  },
  {
    path: 'tabs',
    canActivate:[AuthGuardService],
    loadChildren: () => import('./tabs/tabs.module').then( m => m.TabsPageModule)
  }
  ,

  {
    path: 'start',
    canActivate:[LoginGuardService],
    loadChildren: () => import('./start/start.module').then( m => m.StartPageModule),
  },
  
  {
    path: 'signin',
    loadChildren: () => import('./signin/signin.module').then( m => m.SigninPageModule)
  },
  {
    path: 'myorders',
    canActivate:[AuthGuardService],
    loadChildren: () => import('./my-orders/my-orders.module').then( m => m.MyOrdersPageModule)
  },
  {
    path:'profile',
    canActivate:[AuthGuardService],
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)    
}
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {       }
