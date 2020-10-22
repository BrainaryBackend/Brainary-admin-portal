import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseopsService } from './firebaseops.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'adminapp';

  constructor() { }


  ngOnInit(): void {
  }
}
