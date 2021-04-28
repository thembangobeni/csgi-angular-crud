import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AccountService } from '@app/_services';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private accountService: AccountService
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const user         = this.accountService.userValue;
      //  var lerror         = this.accountService.user;

        //var lstatus         = userv.status;
        //var lresponse       = userv.status
        //var userJson = JSON.parse(user);

       /* switch (user.status) {
            case 404:
              console.error("Can't find file: " + SETTINGS_LOCATION);
              break;
            default:
              console.error(error);
              break;
          }*/

        if (user) {
            // alert('User: '+user.email+ 'token: '+ user.token);
            // authorised so return true
            //alert('returning true');
            return true;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/account/login'], { queryParams: { returnUrl: state.url }});
        return false;
    }
}