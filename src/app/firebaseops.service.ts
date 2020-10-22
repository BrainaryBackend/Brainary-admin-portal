import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFireAuth } from "@angular/fire/auth"
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Lesson } from './models/lessons.model';
import { Course } from './models/course.model';
import { BrainaryUser } from './models/brainary-user.model';
import { User, auth } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class FirebaseopsService {

  constructor(private firestore: AngularFirestore, private storage: AngularFireStorage,private afAuth: AngularFireAuth) { }


  getBraineryCourse(): AngularFirestoreCollection<Course> {
    return this.firestore.collection<Course>('course_list', ref => ref.orderBy('title'));
  }

  getBraineryLessons(): AngularFirestoreCollection<Lesson> {
    return this.firestore.collection<Lesson>('lessons', ref => ref.orderBy('title'));
  }

  uploadFileAndGetMetadata(mediaFolderPath: string, fileToUpload: File): FilesUploadMetadata {
    const { name } = fileToUpload;
    const filePath = `${mediaFolderPath}/${new Date().getTime()}_${name}`;
    const uploadTask: AngularFireUploadTask = this.storage.upload(
      filePath,
      fileToUpload,
    );
    return {
      uploadProgress$: uploadTask.percentageChanges(),
      downloadUrl$: this.getDownloadUrl$(uploadTask, filePath),
    };
  }

  addVideoToLesson(lesson: Lesson): Promise<DocumentReference> {
    return this.firestore.collection<Lesson>('lessons').add(lesson);
  }

  deleteLesson(docId: string){
    return this.firestore.collection<Lesson>('lessons').doc(docId).delete();
  }

  signInWithEmail(email, password) {

   //return this.afAuth.setPersistence( auth.Auth.Persistence.LOCAL).then(()=>{
        return this.afAuth.signInWithEmailAndPassword(email, password);
    //}).catch((err)=>{
    //  console.log(err);
    //})

  }

  getSigninUser(){
    return this.afAuth.currentUser;
  }

  getAllUsers(): AngularFirestoreCollection<BrainaryUser> {
    return this.firestore.collection<BrainaryUser>('users');
  }

  private getDownloadUrl$(
    uploadTask: AngularFireUploadTask,
    path: string,
  ): Observable<string> {
    return from(uploadTask).pipe(
      switchMap((_) => this.storage.ref(path).getDownloadURL()),
    );
  }

  // getInitialJobPosts(): AngularFirestoreCollection<JobPost> {
  //   return this.firestore.collection<JobPost>('jobposts', ref => ref.limit(2).orderBy('createdDate', 'desc'));
  // }

  // fetchNextJobposts(lastPost: JobPost): AngularFirestoreCollection<JobPost> {
  //   return this.firestore.collection<JobPost>('jobposts', ref => ref.limit(2).orderBy('createdDate', 'desc').startAfter(lastPost.createdDate));
  // }

  // getJobPost(jobId: string): AngularFirestoreDocument<JobPost> {
  //   return this.firestore.doc<JobPost>('jobposts/HlMXGey9lkMcDyndtZYH')
  // }

  // addJobPost(jobpost: JobPost): Promise<DocumentReference> {
  //   delete jobpost.id;
  //   return this.firestore.collection("jobposts").add(jobpost);
  // }

  // addCategory(category: Category): Promise<void> {
  //   var obj = { 'display-name': category.displayName, 'tag-short-hand': category.tagName }
  //   var keyName = category.displayName.toLowerCase().replace(" ", "");
  //   return this.firestore.collection('categories').doc(keyName).set(obj);
  // }

  // deleteCategory(categoryName: string): Promise<void> {
  //   var keyName = categoryName.toLowerCase().replace(" ", "");
  //   return this.firestore.collection('categories').doc(keyName).delete();
  // }

  // getStudyMaterials(): Observable<Attachment[]> {
  //   return this.firestore.collection<Attachment>("studymaterial").valueChanges()
  // }

  // addStudyMaterial(attachment: Attachment): Promise<DocumentReference> {
  //   return this.firestore.collection("studymaterial").add(attachment);
  // }

  // modifyJobPost(jobpost): Promise<void> {
  //   return this.firestore.collection("jobposts").doc(jobpost.id).set(jobpost);
  // }

  // deleteJobPost(jobpost): Promise<void> {
  //   return this.firestore.collection("jobposts").doc(jobpost.id).delete();
  // }

  // uploadFileAndGetMetadata(mediaFolderPath: string, fileToUpload: File): FilesUploadMetadata {
  //   const { name } = fileToUpload;
  //   const filePath = `${mediaFolderPath}/${new Date().getTime()}_${name}`;
  //   const uploadTask: AngularFireUploadTask = this.storage.upload(
  //     filePath,
  //     fileToUpload,
  //   );
  //   return {
  //     uploadProgress$: uploadTask.percentageChanges(),
  //     downloadUrl$: this.getDownloadUrl$(uploadTask, filePath),
  //   };
  // }

  // private getDownloadUrl$(
  //   uploadTask: AngularFireUploadTask,
  //   path: string,
  // ): Observable<string> {
  //   return from(uploadTask).pipe(
  //     switchMap((_) => this.storage.ref(path).getDownloadURL()),
  //   );
  // }

  // getCategories(): Observable<Category[]> {
  //   var subject = new Subject<Category[]>();
  //   this.firestore.collection('categories').valueChanges().subscribe(val => {
  //     var categories = val.map(i => new Category(i['display-name'], i['tag-short-hand']));
  //     subject.next(categories);
  //   });
  //   return subject.asObservable()
  // }
}

export interface FilesUploadMetadata {
  uploadProgress$: Observable<number>;
  downloadUrl$: Observable<string>;
}
