import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Course } from '../models/course.model';
import { FirebaseopsService } from '../firebaseops.service';
import { Lesson } from '../models/lessons.model';
import { map, takeUntil, catchError } from 'rxjs/operators';
import { Observable, EMPTY, Subject } from "rxjs";
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-view-course',
  templateUrl: './view-course.component.html',
  styleUrls: ['./view-course.component.css']
})
export class ViewCourseComponent implements OnInit {
  course: Course;
  destroy$: Subject<null> = new Subject();
  allLessons: Lesson[] = [];
  uploadProgress: Observable<number>;
  title: string = '';
  videoToUpload: File;
  thumbnailImage: File;
  currentUploadProgress = 0;
  progressMessage = '';
  isLoading = false;
  imageNotFound = 'https://firebasestorage.googleapis.com/v0/b/beliefhack-brainery-app.appspot.com/o/others%2Fnoimage.jpg?alt=media&token=40d48acc-19e8-4fd7-b6dd-bce05e88520c';
  constructor(private router: Router, private firebaseOps: FirebaseopsService, private readonly snackBar: MatSnackBar) { }

  ngOnInit(): void {
    console.log(history.state);
    if (!('courseId' in history.state)) {
      this.router.navigateByUrl('');
    }
    this.course = history.state;
    this.firebaseOps.getCourseContent(this.course.courseId).snapshotChanges().pipe(
      map(actions => {
        return actions.map(this.documentToLessons);
      })).subscribe(val => {
        console.log(val);
        this.allLessons = val;
      });
  }

  documentToLessons = a => {
    const data = a.payload.doc.data() as Lesson;
    const id = a.payload.doc.id;
    console.log('>>>>>' + id + ' ' + data.title);
    return { id, ...data } as Lesson;
  }

  async submitForm() {
    console.log(this.videoToUpload);
    let duration = '';
    let vid = document.createElement('video');
    var fileURL = URL.createObjectURL(this.videoToUpload);
    vid.src = fileURL;
    vid.ondurationchange = function () {
      let dur = Math.round(vid.duration);
      console.log(dur);
      let min = (dur < 60) ? 0 : Math.trunc(dur / 60);
      let sec = dur % 60;
      duration = `${min} minutes ${sec} second`;
    };
    let videoUrl = await this.uploadFile('lessons/private', this.videoToUpload);
    let imageUrl = (this.thumbnailImage) ? await this.uploadFile('previewImages', this.thumbnailImage) : '';
    console.log(">>>>>>url" + videoUrl);
    this.progressMessage = 'Adding the video to lessons';
    let lesson: Lesson = { length: duration, title: this.title, access: 'public', thumbnailImageUrl: imageUrl, videoUrl: videoUrl }
    this.firebaseOps.addVideoToCourse(lesson, this.course.courseId).then((ref) => {
      console.log(ref);
      this.progressMessage = 'Video Added succesfully.';
    }).catch(err => {
      console.log(err);
    })
  }


  uploadFile(path, file): Promise<string> {
    this.progressMessage = 'Video upload in progress...'
    var response = this.firebaseOps.uploadFileAndGetMetadata(path, file);
    const downloadUrl = response.downloadUrl$;
    this.uploadProgress = response.uploadProgress$;
    console.log(">>>Asssinged values");
    this.uploadProgress.subscribe(val => {
      console.log(val);
      this.currentUploadProgress = val;
    });
    return new Promise<string>(resolve => {
      downloadUrl.pipe(takeUntil(this.destroy$), catchError((error) => {
        console.log(error);
        this.progressMessage = '';
        this.snackBar.open('Error uploading file', 'Close', {});
        resolve(null);
        return EMPTY;
      })).subscribe(downloadUrl => {
        resolve(downloadUrl);
      });
    });
  }

  handleFileInput(files: FileList, type) {
    if (type == 'video') {
      this.videoToUpload = files.item(0);
    } else {
      this.thumbnailImage = files.item(0);
    }
  }

  deletePost(lessonId) {
    this.firebaseOps.deleteLessonFromCourse(lessonId, this.course.courseId)
  }

}
