import { Component, Inject } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'confirm-dialog',
  templateUrl: 'confirm-dialog.html',
})
export class ConfirmDialog {


  constructor(@Inject(MAT_DIALOG_DATA) public data: any){

  }


  ngOnInit() {
    console.log(this.data);
  }

}
