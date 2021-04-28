import { ErrorHandler, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, pipe } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { map, catchError, first } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { Csgi_detailreport_v, User } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class detailreport_vService {
    private detailreport_vSubject: BehaviorSubject<Csgi_detailreport_v>;
    private userSubject: BehaviorSubject<User>;
    public detailreport_v: Observable<Csgi_detailreport_v>;
    public user: Observable<User>;

    stringifiedData: any;  
    parsedJson: any; 
   

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
        this.user = this.userSubject.asObservable();
        this.detailreport_vSubject = new BehaviorSubject<Csgi_detailreport_v>(JSON.parse(localStorage.getItem('detailreport_v')));
        this.detailreport_v = this.detailreport_vSubject.asObservable();

    }

    public get userValue(): User {
        return this.userSubject.value;
    }

    public get detailreport_vValue(): Csgi_detailreport_v {
        return this.detailreport_vSubject.value;
    }


    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.router.navigate(['/account/login']);
    }


    getAll() {
        return this.http.get<Csgi_detailreport_v[]>(`${environment.apiUrl}/api/dbviews`);
    }

    getById(id: string, classid: string, gradeid: string) {
        return this.http.get<Csgi_detailreport_v>(`${environment.apiUrl}/api/dbviews/${id}/${classid}/${gradeid}`);
    }

}