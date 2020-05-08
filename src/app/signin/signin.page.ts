import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {
  user:FormGroup;
  constructor(private fb:FormBuilder,private router:Router) { }

  ngOnInit() {
    this.user=this.fb.group({
      email: ['',Validators.required],
      password:['']
    })
  }
  login(){
    this.router.navigate(['/tabs']);
  }
}
