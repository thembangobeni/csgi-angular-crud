import { ErrorHandler, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, pipe } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { map, catchError, first } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { Csgi_summaryreport_v, User } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class summaryreport_vService {
    private summaryreport_vSubject: BehaviorSubject<Csgi_summaryreport_v>;
    private userSubject: BehaviorSubject<User>;
    public summaryreport_v: Observable<Csgi_summaryreport_v>;
    public user: Observable<User>;

    stringifiedData: any;  
    parsedJson: any; 
   

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
        this.user = this.userSubject.asObservable();
        this.summaryreport_vSubject = new BehaviorSubject<Csgi_summaryreport_v>(JSON.parse(localStorage.getItem('summaryreport_v')));
        this.summaryreport_v = this.summaryreport_vSubject.asObservable();

    }

    public get userValue(): User {
        return this.userSubject.value;
    }

    public get summaryreport_vValue(): Csgi_summaryreport_v {
        return this.summaryreport_vSubject.value;
    }


    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.router.navigate(['/account/login']);
    }


    getAll() {
        return this.http.get<Csgi_summaryreport_v[]>(`${environment.apiUrl}/api/dbviews`);
    }

    getById(id: string, classid: string) {
        return this.http.get<Csgi_summaryreport_v>(`${environment.apiUrl}/api/dbviews/${id}/${classid}`);
    }

}