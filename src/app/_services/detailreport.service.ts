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
    private detailSubject: BehaviorSubject<Csgi_detailreport_v>;
    public detail: Observable<Csgi_detailreport_v>;

    private userSubject: BehaviorSubject<User>;
    public user: Observable<User>;

    stringifiedData: any;  
    parsedJson: any; 
   

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
        this.user = this.userSubject.asObservable();

        this.detailSubject = new BehaviorSubject<Csgi_detailreport_v>(JSON.parse(localStorage.getItem('detailreport_v')));
        this.detail = this.detailSubject.asObservable();

    }

    public get userValue(): User {
        return this.userSubject.value;
    }

    public get detailreport_vValue(): Csgi_detailreport_v {
        return this.detailSubject.value;
    }


    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.router.navigate(['/account/login']);
    }


    getAll() {
        return this.http.get<Csgi_detailreport_v[]>(`${environment.apiUrl}/api/reportdetail`);
    }

    getAllDetailReport(id: String) {
        //alert('call '+id)
        return this.http.get<Csgi_detailreport_v[]>(`${environment.apiUrl}/api/reportdetail/${id}`);
    }


}