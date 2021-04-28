import { ErrorHandler, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, pipe } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { map, catchError, first } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { Csgi_period, User } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class PeriodService {
    private periodSubject: BehaviorSubject<Csgi_period>;
    private userSubject: BehaviorSubject<User>;
    public period: Observable<Csgi_period>;
    public user: Observable<User>;

    stringifiedData: any;  
    parsedJson: any; 
   

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
        this.user = this.userSubject.asObservable();
        this.periodSubject = new BehaviorSubject<Csgi_period>(JSON.parse(localStorage.getItem('period')));
        this.period = this.periodSubject.asObservable();

    }

    public get userValue(): User {
        return this.userSubject.value;
    }

    public get periodValue(): Csgi_period {
        return this.periodSubject.value;
    }


    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.router.navigate(['/account/login']);
    }

    register(period: Csgi_period) {
        return this.http.post(`${environment.apiUrl}/api/period`, period);
    }

    getAll() {
        return this.http.get<Csgi_period[]>(`${environment.apiUrl}/api/period`);
    }

    getById(id: string) {
        return this.http.get<Csgi_period>(`${environment.apiUrl}/api/period/${id}`);
    }

    update(id, params) {
        return this.http.put(`${environment.apiUrl}/api/period/${id}`, params)
            .pipe(map(x => {
                // update stored user if the logged in user updated their own record
                if (id == this.periodValue.periodid) {
                    // update local storage
                    const period = { ...this.periodValue, ...params };
                    localStorage.setItem('period', JSON.stringify(period));

                    // publish updated user to subscribers
                    this.periodSubject.next(period);
                }
                return x;
            }));
    }


    // not allowing deletion for periods by teacher
    delete(id: string) {
        return this.http.delete(`${environment.apiUrl}/api/period/${id}`)
            .pipe(map(x => {
                // auto logout if the logged in user deleted their own record
                if (id == this.periodValue.periodid) {
                    this.logout();
                }
                return x;
            }));
      
              
    }
}