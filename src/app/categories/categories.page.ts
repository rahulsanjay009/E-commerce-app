import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as $ from 'jquery';
@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {
  class1="collapsing navbar-collapse";
  class="collapsing navbar-collapse";  
  fafa1=false;
  fafa=false;
  constructor(private router:Router) { }
  toggle(){
    if(document.getElementById('bacha').getAttribute('aria-expanded')=="true"){
      this.class="collapse navbar-collapse show"
      this.fafa=false;
      this.fafa1=true;
      
      this.class1="collapse navbar-collapse"
      
      
      document.getElementById('bacha1').setAttribute('aria-expanded',"true");
      document.getElementById('bacha').setAttribute('aria-expanded',"false");
      this.fafa1=true;
      console.log(document.getElementById('bacha').getAttribute('aria-expanded'));
    }
      
    else{
      this.class="collapse navbar-collapse";
      this.fafa=true;
      document.getElementById('bacha').setAttribute('aria-expanded',"true");
      
      console.log(document.getElementById('bacha').getAttribute('aria-expanded'));
    }  
}
toggle1(){
  if(document.getElementById('bacha1').getAttribute('aria-expanded')=="true"){
    this.class1="collapse navbar-collapse show";
    this.fafa1=false;
    
    this.fafa=true;
    this.class="collapse navbar-collapse"
    
    
    
    document.getElementById('bacha').setAttribute('aria-expanded',"true");
    document.getElementById('bacha1').setAttribute('aria-expanded',"false");
    console.log(document.getElementById('bacha1').getAttribute('aria-expanded'));
  }
    
  else{
    this.class1="collapse navbar-collapse";
    this.fafa1=true;
    document.getElementById('bacha1').setAttribute('aria-expanded',"true");
    console.log(document.getElementById('bacha1').getAttribute('aria-expanded'));
  }  
}
  ngOnInit() {
  }
  organicVegetable(){
      this.router.navigate(['tabs/categories/',"organic vegetable"]);
  }
  organicFruit(){
    this.router.navigate(['tabs/categories/',"organic fruit"]);
  }
  nonOrganicVegetable(){
    this.router.navigate(['tabs/categories/',"non-organic vegetable"]);
  }
  nonOrganicFruit(){
      this.router.navigate(['tabs/categories/',"non-organic fruit"]);
    }
  organicSnack(){
    this.router.navigate(['tabs/categories/',"organic snack"]);
  }
  organicDryFruit(){
    this.router.navigate(['tabs/categories/',"organic dryfruit"]);
  }
  organicGroceries(){
    this.router.navigate(['tabs/categories/',"organic grocery"]);
  }
  ionViewDidEnter(){
    this.class1="collapsing navbar-collapse";
    this.class="collapsing navbar-collapse";  
    this.fafa1=true;
    this.fafa=true;
  }
}
