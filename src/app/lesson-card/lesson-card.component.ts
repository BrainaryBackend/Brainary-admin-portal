import { Component, OnInit, Input } from '@angular/core';
import { Lesson } from '../models/lessons.model';
import { FirebaseopsService } from '../firebaseops.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from '../dialog/ConfirmDialog';

@Component({
  selector: 'app-lesson-card',
  templateUrl: './lesson-card.component.html',
  styleUrls: ['./lesson-card.component.css']
})
export class LessonCardComponent implements OnInit {

  @Input()
  lesson: Lesson;

  @Input()
  path: string = "";

  imageNotFound = 'https://firebasestorage.googleapis.com/v0/b/beliefhack-brainery-app.appspot.com/o/others%2Fnoimage.jpg?alt=media&token=40d48acc-19e8-4fd7-b6dd-bce05e88520c';
  constructor(private firebaseOps: FirebaseopsService, private readonly snackBar: MatSnackBar, private dialog: MatDialog) { }

  ngOnInit(): void {

  }

  deletePost() {
    const dialogRef = this.dialog.open(ConfirmDialog, { data: "Are you sure you want to delete the lesson ?" });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.firebaseOps.deleteFileFromFireStore(this.lesson.thumbnailImageUrl);
        this.firebaseOps.deleteFileFromFireStore(this.lesson.videoUrl);
        (this.path === '') ? this.firebaseOps.deleteLesson(this.lesson.id) : this.firebaseOps.deleteLessonFromCourse(this.lesson.id, this.path);
      }
    });
  }

  viewPost() {
    console.log(this.path)
    window.open(this.lesson.videoUrl, '_blank')
    //  this.firebaseOps.deleteLesson(lesson.id)
  }

}
