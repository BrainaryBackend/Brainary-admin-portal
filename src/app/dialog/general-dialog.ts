import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'general-dialog',
  templateUrl: 'general-dialog.html',
})
export class GeneralDialog {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any){

  }

  ngOnInit() {
    console.log(this.data);
  }
}
