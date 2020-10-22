import { Component, OnInit } from '@angular/core';
import { FirebaseopsService } from '../firebaseops.service';
import { map, takeUntil, catchError } from 'rxjs/operators';
import { Lesson } from '../models/lessons.model';
import { Observable, EMPTY, Subject } from "rxjs";
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
//import { AngularFireUploadTask } from 'angularfire2/storage';

@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.css']
})
export class LessonComponent implements OnInit {
  destroy$: Subject<null> = new Subject();
  allLessons: Lesson[] = [];
  uploadProgress: Observable<number>;
  title: string = '';
  videoToUpload: File;
  thumbnailImage: File;
  currentUploadProgress = 0;
  progressMessage = '';
  isLoading = false;
  //task: AngularFireUploadTask;

  constructor(private firebaseOps: FirebaseopsService, private readonly snackBar: MatSnackBar, private dialog: MatDialog, private router: Router) { }

  ngOnInit(): void {
    // this.firebaseOps.getSigninUser().then(val=>{
    //     //console.log(val.uid);
    //     if(val==null){
    //       this.router.navigateByUrl('login');
    //     }

    // });
    this.firebaseOps.getBraineryLessons().snapshotChanges().pipe(
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
    console.log('>>>>>'+id+' '+data.title);
    return { id, ...data } as Lesson;
  }

  handleFileInput(files: FileList, type) {
    if (type == 'video') {
      this.videoToUpload = files.item(0);
    } else {
      this.thumbnailImage = files.item(0);
    }

  }


  upload(event) {
    // const id = Math.random().toString(36).substring(2);
    // this.ref = this.afStorage.ref(id);
    // this.task = this.ref.put(event.target.files[0]);
    // this.uploadProgress = //this.task.percentageChanges();
  }

  async submitForm() {
    console.log(this.videoToUpload);
    let duration = '';
    let vid = document.createElement('video');
    var fileURL = URL.createObjectURL(this.videoToUpload);
    vid.src = fileURL;
    vid.ondurationchange = function () {
      alert(vid.duration);
      let dur = Math.round(vid.duration);
      console.log(dur);
      let min = (dur<60) ? 0: (dur / 60);
      let sec = dur % 60;
      duration = `${min} minutes ${sec} second`;
    };
    let videoUrl = await this.uploadFile('lessons/private', this.videoToUpload);
    let imageUrl = (this.thumbnailImage) ? await this.uploadFile('previewImages', this.thumbnailImage) : '';
    console.log(">>>>>>url" + videoUrl);
    this.progressMessage = 'Adding the video to lessons';
    let lesson: Lesson = {  length: duration, title: this.title, access: 'public', thumbnailImageUrl: imageUrl, videoUrl: videoUrl }
    this.firebaseOps.addVideoToLesson(lesson).then((ref)=>{
        console.log(ref);
    }).catch(err=>{
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

  deletePost(){

  }

}
