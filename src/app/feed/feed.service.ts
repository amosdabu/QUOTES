/*FeedService
 *get snapshots from all user (friends,following,all user) and all their quotations.
 *manage all user and quotes in the feed
 *gets the quotes details and pass to note detail component
 *cnanges in the db
    *-update
        *-edit
        *-change settings 
        *-likes(hearts)
    *-remove
    *-create
    
 */

import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection,AngularFirestoreDocument} from 'angularfire2/firestore';
import {AngularFireAuth} from 'angularfire2/auth';
import {Note} from './note-model';
import {UserService} from '../users/user.service';
import {User} from '../users/user-model';
import {Observable} from 'rxjs/Observable';
import {map} from 'rxjs/operators';
import {AuthService} from '../core/auth.service';
import {PushNotificationsService} from 'ng-push'


interface NewNote {
    content: string;
    hearts: 0;
    time: number;
}
interface NewUser {
    uid: string;
    email ? : string | null;
    photoURL ? : string;
    displayName ? : string;
    discription ? : string;
}


@Injectable()
export class FeedService {
    user;
    uname;
    userIds;
    currentUserUid = "";
    currentUserName = "";
    currentUserPhotoURL = ""
    ppp: any;
    notesCollectionU: AngularFirestoreCollection < Note > ;
    notesCollection: AngularFirestoreCollection < Note > ;
    noteDocument: AngularFirestoreDocument < Node > ;
    usersCollection: AngularFirestoreCollection < User > ;
    userDocument: AngularFirestoreDocument < Note > ;
    user1: AngularFirestoreDocument < User > ;
    note1:AngularFirestoreDocument < Node > 
    constructor(private afs: AngularFirestore,
        public auth: AuthService,
        private userService: UserService,
        private afAuth: AngularFireAuth,
        private _pushNotifications: PushNotificationsService, ) {

        if (this.afAuth.auth.currentUser) {
            this.currentUserUid = this.afAuth.auth.currentUser.uid;
            if (this.afAuth.auth.currentUser.displayName)
                this.currentUserName = this.afAuth.auth.currentUser.displayName;
            if (this.afAuth.auth.currentUser.photoURL)
                this.currentUserPhotoURL = this.afAuth.auth.currentUser.photoURL;
        } else
            console.error("NULL ID")

        // this.notesCollection = this.afs.collection(`users/${this.currentUserUid}/notes/`, (ref) => ref.orderBy('time', 'desc') );
        this.notesCollectionU = this.afs.collection(`users/${this.currentUserUid}/notes/`, (ref) => ref.orderBy('time', 'desc').limit(1) );

        this.usersCollection = this.afs.collection('users/', (ref) => ref);
        this.user1= this.afs.doc(`users/${this.currentUserUid}`);
        this.note1;
        localStorage.feedRand=0;
        localStorage.rand='true';

        console.log(localStorage.feedRand)
    }

    getSnapshotU1(): Observable < User > {
        ['added', 'modified', 'removed']
        return this.user1.snapshotChanges().map((a) => {
                const data = a.payload.data() as User;
                return {
                    id: a.payload.id,
                    email: data.email,
                    photoURL: data.photoURL,
                    displayName: data.displayName,
                    discription: data.discription,
                    uid: data.uid,
                    friendsList:data.friendsList||[],
                    followList:data.followList||[],

                };
        });

    }
    /*get snapshotChanges for all necessary users for the current feed*/

    getSnapshotU(): Observable < User[] > {
        ['added', 'modified', 'removed']
        return this.usersCollection.snapshotChanges().map((actions) => {
            return actions.map((a) => {
                const data = a.payload.doc.data() as User;
                return {
                    id: a.payload.doc.id,
                    email: data.email,
                    photoURL: data.photoURL,
                    displayName: data.displayName,
                    discription: data.discription,
                    uid: data.uid
                };
            });
        });

    }

    //get notesCollection Observable
    getData(): Observable < Note[] > {
        return this.notesCollection.valueChanges();
    }

    getSnapshot(): Observable < Note[] > {
        ['added', 'modified', 'removed']
        return this.notesCollectionU.snapshotChanges().map((actions) => {
            return actions.map((a) => {
                const data = a.payload.doc.data() as Note;
                return {
                    id: a.payload.doc.id,
                    content: data.content,
                    hearts: data.hearts,
                    heartsList: data.heartsList,
                    heartsListNames: data.heartsListNames,
                    time: data.time,
                    authorId: data.authorId,
                    authorName: data.authorName,
                    authorPhotoURL: data.authorPhotoURL,
                    settings:data.settings
                };
            });
        });
    }

    /*get snapshotChanges for all necessary notes for the current feed*/
    getSnapshotN1(uid: string,nid: string): Observable < Note > {
        ['added', 'modified', 'removed']
        this.note1 = this.afs.doc(`users/${uid}/notes/${nid}`);
        this.note1 = this.afs.doc(`/users/K91tLU7SLEeexdsW2LmGDOFrRaa2/notes/tcQnw8DJi0xuDCYztIh2`);


        // let i=0;
        return this.note1.snapshotChanges().map((a) => {
                const data = a.payload.data() as Note;
                return {
                    id: a.payload.id,
                    content: data.content,
                    hearts: data.hearts,
                    heartsList: data.heartsList,
                    heartsListNames: data.heartsListNames,
                    time: data.time,
                    authorId: data.authorId,
                    authorName: data.authorName,
                    authorPhotoURL: data.authorPhotoURL,
                    settings:data.settings
                };
            });
        
    }
    /*get snapshotChanges for all necessary notes for the current feed*/
    getSnapshotN(uid: string): Observable < Note[] > {
        ['added', 'modified', 'removed']
        this.notesCollection = this.afs.collection(`users/${uid}/notes/`, (ref) => ref.orderBy('time', 'desc') /*.limit()*/ );
        // let i=0;
        return this.notesCollection.snapshotChanges().map((actions) => {
            return actions.map((a) => {
                const data = a.payload.doc.data() as Note;
                return {
                    id: a.payload.doc.id,
                    content: data.content,
                    hearts: data.hearts,
                    heartsList: data.heartsList,
                    heartsListNames: data.heartsListNames,
                    time: data.time,
                    authorId: data.authorId,
                    authorName: data.authorName,
                    authorPhotoURL: data.authorPhotoURL,
                    settings:data.settings
                };
            });
        });
    }

    getUser(uid: string) {
        return this.afs.doc < User > (`users/${uid}`);
    }

    
    getNote2(id: string, uid: string) {
        return this.afs.doc < Note > (`users/${uid}/notes/${id}`);
    }
    updateNote2(id: string, data: Partial < Note > , uid: string) {
        return this.getNote2(id, uid).update(data);
    }
    
    //get specific note by uid and note id
    getNote(id: string, uid: string) {
        return this.afs.doc < Note > (`users/${uid}/notes/${id}`);
    }

    getCurrentUid() {
        return (this.currentUserUid);
    }

  getSnapshotU2(): Observable < User > {
        ['added', 'modified', 'removed']
            return this.user1.snapshotChanges().map((a) => {
                const data = a.payload.data() as User;
                console.log(data.uid);
                return {
                    id: a.payload.id,
                    email: data.email,
                    photoURL: data.photoURL,
                    displayName: data.displayName,
                    discription: data.discription,
                    uid: data.uid
                };
            });
    }
    getCurrentName(): String {
        let name;
        if(this.currentUserName==""){
            let  user = this.getSnapshotU2()
            user.forEach(a => {
                    if (a.displayName)
                        this.uname=a.displayName.toString()
                        localStorage.setItem('tmpdisplayName', this.uname);
            });
        }
        name=localStorage.tmpdisplayName
        localStorage.removeItem('tmpdisplayName');
        return (this.currentUserName||name);
    }

    /*create new note call this.createNote with the right prameters*/
    create(content: string,settings?:string) {
        const itemsRef = < any > this.afs.doc(`users/${this.currentUserUid}`).valueChanges();

        return itemsRef
            .take(1)
            .toPromise().then((data) => {
                this.createNote(data.photoURL, data.displayName, content,settings)
            });
    }


    /*create new note*/
    createNote(PhotoURL, displayName, content: string,settings?:string) {
        this.notesCollection = this.afs.collection(`users/${this.currentUserUid}/notes/`, (ref) => ref.orderBy('time', 'desc') /*.limit()*/ );
        const note = {
            content,
            hearts: 0,
            time: new Date().getTime(),
            authorName: displayName,
            authorId: this.currentUserUid,
            authorPhotoURL: PhotoURL,
            settings:settings||'public'
        };
        // console.log(this.getValueFromObservable())     
        return this.notesCollection.add(note);
    }
    //Update Partial or full note info
    updateNote(id: string, data: Partial < Note > , uid: string) {
        return this.getNote(id, uid).update(data);
    }
    

    deleteNote(id: string, uid: string) {
        return this.getNote(id, uid).delete();
    }

    /*pushNotification*/
    pushNotification(data: string) {
        this._pushNotifications.requestPermission()
        this._pushNotifications.create('Quote-Me', {
            body: data,
            dir: 'auto',
            icon: "https://quote-me-d966f.firebaseapp.com/assets/images/icons/PF-004.png"
        }).subscribe(
            res => console.log(res),
            err => console.log(err)
        )

    }

}