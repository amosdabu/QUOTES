import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';

import { Note } from './note-model';
import { UserService } from '../users/user.service';
import { User } from '../users/user-model';

import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { AuthService } from '../core/auth.service';

import { PushNotificationsService } from 'ng-push'
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
export class NoteService {
    user;
    userIds;
    currentUserUid = ""
    currentUserName = ""
    currentUserPhotoURL = ""
    notesCollection: AngularFirestoreCollection < Note > ;
    noteDocument: AngularFirestoreDocument < Node > ;
    usersCollection: AngularFirestoreCollection < User > ;
    userDocument: AngularFirestoreDocument < Node > ;

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

        this.notesCollection = this.afs.collection(`users/${this.currentUserUid}/notes/`, (ref) => ref.orderBy('time', 'desc') /*.limit()*/ );
        this.usersCollection = this.afs.collection('users/', (ref) => ref);

    }


    //get Snapshots of all the current user data 
    getSnapshotU(): Observable < User[] > {
        ['added', 'modified', 'removed']
        return this.usersCollection.snapshotChanges().map((actions) => {
            return actions.map((a) => {
                const data = a.payload.doc.data() as User;
                console.log(data.uid);
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

    getNote2(id: string, uid: string) {
        return this.afs.doc < Note > (`users/${uid}/notes/${id}`);
    }

    updateNote2(id: string, data: Partial < Note > , uid: string) {
        return this.getNote2(id, uid).update(data);
    }

    getData(): Observable < Note[] > {
        return this.notesCollection.valueChanges();
    }

    //get Snapshots of all the notes of this current user 
    getSnapshot(): Observable < Note[] > {
        ['added', 'modified', 'removed']
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
                    authorPhotoURL: data.authorPhotoURL
                };
            });
        });
    }

    getNote(id: string) {
        return this.afs.doc < Note > (`users/${this.currentUserUid}/notes/${id}`);
    }

    /*create new note call this.createNote with the right prameters*/
    create(content: string) {
        const itemsRef = < any > this.afs.doc(`users/${this.currentUserUid}`).valueChanges();

        return itemsRef
            .take(1)
            .toPromise().then((data) => {
                this.createNote(data.photoURL, data.displayName, content)
            });
    }


    /*create new note*/
    createNote(PhotoURL, displayName, content: string) {
        const note = {
            content,
            hearts: 0,
            time: new Date().getTime(),
            authorName: displayName,
            authorId: this.currentUserUid,
            authorPhotoURL: PhotoURL,
            heartsList: [],

        };
        return this.notesCollection.add(note);
    }

    updateNote(id: string, data: Partial < Note > ) {
        return this.getNote(id).update(data);
    }

    deleteNote(id: string) {
        return this.getNote(id).delete();
    }


    getCurrentUid() {
        return (this.currentUserUid);
    }

    getCurrentName(): String {
        return (this.currentUserName);
    }

}