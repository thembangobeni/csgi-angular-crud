import { ErrorHandler, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, pipe } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { map, catchError, first } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { Csgi_grade, User } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class GradeService {
    private gradeSubject: BehaviorSubject<Csgi_grade>;
    private userSubject: BehaviorSubject<User>;
    public grade: Observable<Csgi_grade>;
    public user: Observable<User>;

    stringifiedData: any;  
    parsedJson: any; 
   

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
        this.user = this.userSubject.asObservable();
        this.gradeSubject = new BehaviorSubject<Csgi_grade>(JSON.parse(localStorage.getItem('grade')));
        this.grade = this.gradeSubject.asObservable();

    }

    public get userValue(): User {
        return this.userSubject.value;
    }

    public get gradeValue(): Csgi_grade {
        return this.gradeSubject.value;
    }


    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.router.navigate(['/account/login']);
    }

    register(grade: Csgi_grade) {
        return this.http.post(`${environment.apiUrl}/api/grade`, grade);
    }

    getAll() {
        return this.http.get<Csgi_grade[]>(`${environment.apiUrl}/api/grade`);
    }

    getById(id: string) {
        return this.http.get<Csgi_grade>(`${environment.apiUrl}/api/grade/${id}`);
    }

    update(id, params) {
        return this.http.put(`${environment.apiUrl}/api/grade/${id}`, params)
            .pipe(map(x => {
                // update stored user if the logged in user updated their own record
                if (id == this.gradeValue.gradeid) {
                    // update local storage
                    const grade = { ...this.gradeValue, ...params };
                    localStorage.setItem('grade', JSON.stringify(grade));

                    // publish updated user to subscribers
                    this.gradeSubject.next(grade);
                }
                return x;
            }));
    }


    // not allowing deletion for grades by teacher
    delete(id: string) {
        return this.http.delete(`${environment.apiUrl}/api/grade/${id}`)
            .pipe(map(x => {
                // auto logout if the logged in user deleted their own record
                if (id == this.gradeValue.gradeid) {
                    this.logout();
                }
                return x;
            }));
      
              
    }
}