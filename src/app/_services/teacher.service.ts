import { ErrorHandler, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, pipe } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { map, catchError, first } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { Csgi_teacher_v, User } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class teacherService {
    private teacherSubject: BehaviorSubject<Csgi_teacher_v>;
    private userSubject: BehaviorSubject<User>;
    public teacher: Observable<Csgi_teacher_v>;
    public user: Observable<User>;

    stringifiedData: any;  
    parsedJson: any; 
   

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
        this.user = this.userSubject.asObservable();
        this.teacherSubject = new BehaviorSubject<Csgi_teacher_v>(JSON.parse(localStorage.getItem('teacher')));
        this.teacher = this.teacherSubject.asObservable();

    }

    public get userValue(): User {
        return this.userSubject.value;
    }

    public get teacherValue(): Csgi_teacher_v {
        return this.teacherSubject.value;
    }


    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.router.navigate(['/account/login']);
    }

    register(teacher: Csgi_teacher_v) {
        return this.http.post(`${environment.apiUrl}/api/teacher`, teacher);
    }

    getAll() {
        return this.http.get<Csgi_teacher_v[]>(`${environment.apiUrl}/api/teacher`);
    }

    getById(id: string) {
        return this.http.get<Csgi_teacher_v>(`${environment.apiUrl}/api/teacher/${id}`);
    }

    update(id, params) {
        return this.http.put(`${environment.apiUrl}/api/teacher/${id}`, params)
            .pipe(map(x => {
                // update stored user if the logged in user updated their own record
                if (id == this.teacherValue.teacherid) {
                    // update local storage
                    const teacher = { ...this.teacherValue, ...params };
                    localStorage.setItem('teacher', JSON.stringify(teacher));

                    // publish updated user to subscribers
                    this.teacherSubject.next(teacher);
                }
                return x;
            }));
    }


    // not allowing deletion for teachers by teacher
    delete(id: string) {
        return this.http.delete(`${environment.apiUrl}/api/teacher/${id}`)
            .pipe(map(x => {
                // auto logout if the logged in user deleted their own record
                if (id == this.teacherValue.teacherid) {
                    this.logout();
                }
                return x;
            }));
      
              
    }
}