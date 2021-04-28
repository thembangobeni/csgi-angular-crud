import { ErrorHandler, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, pipe } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { map, catchError, first } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { Csgi_roster, User } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class RosterService {
    private rosterSubject: BehaviorSubject<Csgi_roster>;
    private userSubject: BehaviorSubject<User>;
    public roster: Observable<Csgi_roster>;
    public user: Observable<User>;

    stringifiedData: any;  
    parsedJson: any; 
   

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
        this.user = this.userSubject.asObservable();
        this.rosterSubject = new BehaviorSubject<Csgi_roster>(JSON.parse(localStorage.getItem('roster')));
        this.roster = this.rosterSubject.asObservable();

    }

    public get userValue(): User {
        return this.userSubject.value;
    }

    public get rosterValue(): Csgi_roster {
        return this.rosterSubject.value;
    }


    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.router.navigate(['/account/login']);
    }

    register(roster: Csgi_roster) {
        return this.http.post(`${environment.apiUrl}/api/roster`, roster);
    }

    getAll() {
        return this.http.get<Csgi_roster[]>(`${environment.apiUrl}/api/roster`);
    }

    getById(id: string) {
        return this.http.get<Csgi_roster>(`${environment.apiUrl}/api/roster/${id}`);
    }

    update(id:string, params:any) {
        return this.http.put(`${environment.apiUrl}/api/roster/${id}`, params)
            .pipe(map(x => {
                // update stored user if the logged in user updated their own record
                if (id == this.rosterValue.rosterid) {
                    // update local storage
                    const roster = { ...this.rosterValue, ...params };
                    localStorage.setItem('roster', JSON.stringify(roster));

                    // publish updated user to subscribers
                    this.rosterSubject.next(roster);
                }
                return x;
            }));
    }


    // not allowing deletion for rosters by teacher
    delete(id: string) {
        return this.http.delete(`${environment.apiUrl}/api/roster/${id}`)
            .pipe(map(x => {
                // auto logout if the logged in user deleted their own record
                if (id == this.rosterValue.rosterid) {
                    this.logout();
                }
                return x;
            }));
      
              
    }
}