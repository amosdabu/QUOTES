/*AppRoutingModule 
**init app paths and routes
*/
import { NgModule } from '@angular/core';
import { Routes, RouterModule, provideRoutes } from '@angular/router';
import { UserLoginComponent } from './ui/user-login/user-login.component';
// import { ItemsListComponent } from './items/items-list/items-list.component';
import { ReadmePageComponent } from './ui/readme-page/readme-page.component';
// import { NotesListComponent } from './notes/notes-list/notes-list.component';
import { FeedListComponent } from './feed/notes-list/notes-list.component';
import { UsersListComponent } from './users/users-list/users-list.component';
import { NotesPListComponent } from './myquotes/notes-list/notes-list.component';
// import { FeedListComponent} from './feed/notes-list/notes-list.component';
import { FollowingListComponent } from './following/following-list/following-list.component';
import { FriendsListComponent2 } from './friends2/friends-list/friends-list.component';
import { FriendsRequestsListComponent } from './friends_requests/friends-list/friends-list.component';
import { UserProfile1Component } from './ui/user-profile1/user-profile1.component';
import { AddonComponent } from './ui/addon/addon.component';
import { AuthGuard } from './core/auth.guard';
import { CoreModule } from './core/core.module';

const routes: Routes = [
  { path: 'about', component: ReadmePageComponent },
  { path: '', component: FeedListComponent,  canActivate: [AuthGuard] },
  { path: 'login', component: UserLoginComponent },
  { path: 'login1/:mod', component: UserLoginComponent },
  { path: 'signin/:mod', component: UserLoginComponent },

  // { path: 'notes', component: NotesListComponent,  canActivate: [AuthGuard] },
  { path: 'feed', component: FeedListComponent,  canActivate: [AuthGuard] },
  { path: 'myquotes', component: NotesPListComponent,  canActivate: [AuthGuard] },
  { path: 'users/:id', component: UsersListComponent,  canActivate: [AuthGuard] },
  { path: 'following', component: FollowingListComponent,  canActivate: [AuthGuard] },
  { path: 'friends2', component: FriendsListComponent2,  canActivate: [AuthGuard] },
  { path: 'friends_requests', component: FriendsRequestsListComponent,  canActivate: [AuthGuard] },
  { path: 'userprofile1', component: UserProfile1Component,  canActivate: [AuthGuard] },
  { path: 'addon', component: AddonComponent,  canActivate: [AuthGuard] },

  // uploads 
  { path: 'uploads', loadChildren: './uploads/shared/upload.module#UploadModule', canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule { }
// export const APP_ROUTER_PROVIDERS = [provideRoutes(routes)];