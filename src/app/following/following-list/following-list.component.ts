/* FollowingListComponent(following)
 * Manage the following user list.*/
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UserService } from '../user.service';

import { Friend } from '../friend-model';
import { User } from '../user-model';
import { Note } from '../../feed/note-model';
import { NoteDetailComponent } from '../../feed/note-detail/note-detail.component';
import { FeedService } from '../../feed/feed.service';

import { Observable } from 'rxjs/Observable';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';

import { AuthService } from '../../core/auth.service';
import { AppRoutingModule } from '../../app-routing.module';

@Component({
  selector: 'following-list',
  templateUrl: './following-list.component.html',
  styleUrls: ['./following-list.component.scss'],
})
export class FollowingListComponent implements OnInit {
  empty=true;
  users: Observable<User[]>;
  content: string;
  notes: Observable<Note[]>;
    user: Observable<User | null>;
  friends:Observable<Friend[]>;
  constructor(private userService: UserService,
              public auth: AuthService,
              private afAuth: AngularFireAuth,
              private afs: AngularFirestore,
              private route: ActivatedRoute,    
              ) { }

  ngOnInit() {
    this.users = this.userService.getSnapshot();
    this.friends =this.userService.getSnapshotF();

    this.friends.forEach(friend => {
      if(friend[0])
        this.empty=false
        else
        this.empty=true;
    });



    this.user = this.afAuth.authState
      .switchMap((user) => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return Observable.of(null);
        }
      });

  }

}
