import { Component, OnInit } from '@angular/core';
import { FirebaseopsService } from '../firebaseops.service';
import { JobPost } from '../models/jobpost.model';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from '../dialog/ConfirmDialog';
import { GeneralDialog } from '../dialog/general-dialog';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router, private firebaseOps: FirebaseopsService) {

  }

  ngOnInit(): void {
    //let uid = sessionStorage.getItem('uid');
    //if (uid == null) {
      this.firebaseOps.getSigninUser().then(val => {
        if (val == null) {
          this.router.navigateByUrl('login');
        }
      });
    }



}
