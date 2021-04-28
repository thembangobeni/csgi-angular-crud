import { ErrorHandler, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, pipe } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { map, catchError, first } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { Csgi_class, User } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class ClassService {
    private classSubject: BehaviorSubject<Csgi_class>;
    private userSubject: BehaviorSubject<User>;
    public classes: Observable<Csgi_class>;
    public user: Observable<User>;

    stringifiedData: any;  
    parsedJson: any; 
   

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
        this.user = this.userSubject.asObservable();
        this.classSubject = new BehaviorSubject<Csgi_class>(JSON.parse(localStorage.getItem('classes')));
        this.classes = this.classSubject.asObservable();

    }

    public get userValue(): User {
        return this.userSubject.value;
    }

    public get classValue(): Csgi_class {
        return this.classSubject.value;
    }


    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.router.navigate(['/account/login']);
    }

    register(classes: Csgi_class) {
        return this.http.post(`${environment.apiUrl}/api/class`, classes);
    }

    getAll() {
        return this.http.get<Csgi_class[]>(`${environment.apiUrl}/api/class`);
    }

    getById(id: string) {
        return this.http.get<Csgi_class>(`${environment.apiUrl}/api/class/${id}`);
    }

    update(id, params) {
        return this.http.put(`${environment.apiUrl}/api/class/${id}`, params)
            .pipe(map(x => {
                // update stored user if the logged in user updated their own record
                if (id == this.classValue.classid) {
                    // update local storage
                    const classData = { ...this.classValue, ...params };
                    localStorage.setItem('class', JSON.stringify(classData));

                    // publish updated user to subscribers
                    this.classSubject.next(classData);
                }
                return x;
            }));
    }


    // not allowing deletion for classs by teacher
    delete(id: string) {
        return this.http.delete(`${environment.apiUrl}/api/class/${id}`)
            .pipe(map(x => {
                // auto logout if the logged in user deleted their own record
                if (id == this.classValue.classid) {
                    this.logout();
                }
                return x;
            }));
      
              
    }
}