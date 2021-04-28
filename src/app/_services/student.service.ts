import { ErrorHandler, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, pipe } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { map, catchError, first } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { Csgi_student, User } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class StudentService {
    private studentSubject: BehaviorSubject<Csgi_student>;
    private userSubject: BehaviorSubject<User>;
    public student: Observable<Csgi_student>;
    public user: Observable<User>;

    stringifiedData: any;  
    parsedJson: any; 
   

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
        this.user = this.userSubject.asObservable();
        this.studentSubject = new BehaviorSubject<Csgi_student>(JSON.parse(localStorage.getItem('student')));
        this.student = this.studentSubject.asObservable();

    }

    public get userValue(): User {
        return this.userSubject.value;
    }

    public get studentValue(): Csgi_student {
        return this.studentSubject.value;
    }


    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.router.navigate(['/account/login']);
    }

    register(student: Csgi_student) {
        return this.http.post(`${environment.apiUrl}/api/student`, student);
    }

    getAll() {
        return this.http.get<Csgi_student[]>(`${environment.apiUrl}/api/student`);
    }

    getById(id: string) {
        return this.http.get<Csgi_student>(`${environment.apiUrl}/api/student/${id}`);
    }

    update(id, params) {
        return this.http.put(`${environment.apiUrl}/api/student/${id}`, params)
            .pipe(map(x => {
                // update stored user if the logged in user updated their own record
                if (id == this.studentValue.studentid) {
                    // update local storage
                    const student = { ...this.studentValue, ...params };
                    localStorage.setItem('student', JSON.stringify(student));

                    // publish updated user to subscribers
                    this.studentSubject.next(student);
                }
                return x;
            }));
    }


    // not allowing deletion for students by teacher
    delete(id: string) {
        return this.http.delete(`${environment.apiUrl}/api/student/${id}`)
            .pipe(map(x => {
                // auto logout if the logged in user deleted their own record
                if (id == this.studentValue.studentid) {
                    this.logout();
                }
                return x;
            }));
      
              
    }
}