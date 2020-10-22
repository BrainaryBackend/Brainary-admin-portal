import { Component, OnInit } from '@angular/core';
import { FirebaseopsService } from '../firebaseops.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string;
  password: string;
  isLoading = false;
  hideLogin = false;

  constructor(private firebaseOps: FirebaseopsService, private router: Router) { }

  ngOnInit(): void {
     let uid = sessionStorage.getItem('uid');
    let username = sessionStorage.getItem('login');
    let password = atob(sessionStorage.getItem('pwd')) ;
    if (uid) {
      this.hideLogin = true;
      this.isLoading = true;
      this.firebaseOps.signInWithEmail(username, password).then(()=>{
        this.router.navigateByUrl('');
      })

    }
  }

  submitForm() {
    this.firebaseOps.signInWithEmail(this.username, this.password).then(val => {
      console.log(val);
      console.log(val.user.uid);
      console.log(val.credential);
      console.log(val.user.refreshToken)
      console.log(val.additionalUserInfo);
      sessionStorage.setItem('uid', val.user.uid);
      sessionStorage.setItem('login', this.username);
      sessionStorage.setItem('pwd', btoa(this.password) );
      this.router.navigateByUrl('');
    })
  }

}
