/*prevent users from accessing areas that they’re not allowed to access
 *angular/router
 *auth.service
 */

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthService} from './auth.service';
import { NotifyService } from './notify.service';
import { Observable } from 'rxjs/Observable';
import { map, take, tap } from 'rxjs/operators';

//prevent users from accessing areas that they’re not allowed to access
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router, private notify: NotifyService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {

    return this.auth.user.pipe(
      take(1),
      map((user) => !!user),
      tap((loggedIn) => {
        if (!loggedIn) {
          console.log('access denied');
          this.notify.update('You must be logged in!', 'error');
          this.router.navigate(['/login']);
        }
      }),
    );
  }
}
