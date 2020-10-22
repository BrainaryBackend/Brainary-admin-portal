import { Component, OnInit } from '@angular/core';
import { FirebaseopsService } from '../firebaseops.service';
import { BrainaryUser } from '../models/brainary-user.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  users: BrainaryUser[];
  constructor(private firebaseOps: FirebaseopsService) { }

  ngOnInit(): void {
    console.log(">>>>>>>>>>>>");
      this.firebaseOps.getAllUsers().valueChanges().subscribe(val=>{
        console.log(val);
        this.users = val;
      })
  }



}
