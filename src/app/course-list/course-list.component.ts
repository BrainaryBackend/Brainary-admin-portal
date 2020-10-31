import { Component, OnInit } from '@angular/core';
import { FirebaseopsService } from '../firebaseops.service';
import { MatDialog } from '@angular/material/dialog';
import { Subject, Observable, EMPTY } from 'rxjs';
import { Lesson } from '../models/lessons.model';
import { map, takeUntil, catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Course } from '../models/course.model';
import { Router } from '@angular/router';
import { GeneralDialog } from '../dialog/general-dialog';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent implements OnInit {

  destroy$: Subject<null> = new Subject();
  allCourses: Course[] = [];
  uploadProgress: Observable<number>;
  title: string = '';
  videoToUpload: File;
  thumbnailImage: File;
  currentUploadProgress = 0;
  progressMessage = '';
  isLoading = false;

  constructor(private firebaseOps: FirebaseopsService, private readonly snackBar: MatSnackBar, private router: Router, private dialog: MatDialog ) {

  }

  documentToCourses = a => {
    const data = a.payload.doc.data() as Course;
    const id = a.payload.doc.id;
    console.log('>>>>>' + id + ' ' + data.id);
    return { id, ...data } as Course;
  }

  ngOnInit(): void {
    this.firebaseOps.getCourseList().snapshotChanges().pipe(
      map(actions => {
        return actions.map(this.documentToCourses);
      })).subscribe(val => {
        console.log(val);
        this.allCourses = val;
      });
  }


  handleFileInput(files: FileList, type) {
    if (type == 'video') {
      this.videoToUpload = files.item(0);
    } else {
      this.thumbnailImage = files.item(0);
    }
  }


  async submitForm() {
    let duration = '';
    let imageUrl = (this.thumbnailImage) ? await this.uploadFile('previewImages', this.thumbnailImage) : '';
    let courseId = this.title.toLowerCase().split(" ").join("_");
    let course: Course = { courseId: courseId, courseName: this.title, previewImage: imageUrl }
    this.firebaseOps.addNewCourse(course).then((ref) => {
      console.log(ref);
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

  deletePost(lessonId) {
    this.firebaseOps.deleteLesson(lessonId).then(()=> {
      this.dialog.open(GeneralDialog, { data: "Lesson deleted" });
    })
  }
  deleteCourse(course: Course) {
    this.firebaseOps.getCourseContent(course.courseId).valueChanges().subscribe(val => {
       console.log(val.length);
       if(val.length==0) {
        this.firebaseOps.deleteCourse(course);  
       }else{
        this.dialog.open(GeneralDialog, { data: "The course cannot be deleted. It isn't empty" });
       }
    })
    // this.firebaseOps.deleteCourse(course);
  }
  openCourse(course) {
    this.router.navigateByUrl('/course', { state: course });
  }
}
