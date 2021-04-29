import { ErrorHandler, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient,HttpResponse } from '@angular/common/http';
import { BehaviorSubject, config, Observable, of, pipe, throwError } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { map, catchError, first, tap } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { Csgi_student } from '@app/_models';
import { AjaxResponse } from '@app/_helpers';

@Injectable({ providedIn: 'root' })
export class StudentService {
    [x: string]: any;
    private studentSubject: BehaviorSubject<Csgi_student>;
    public student: Observable<Csgi_student>;

    stringifiedData: any;  
    parsedJson: any; 
   

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
       // this.studentSubject = new BehaviorSubject<Csgi_student>(JSON.parse(localStorage.getItem('student')));
        this.studentSubject = new BehaviorSubject<Csgi_student>(JSON.parse(localStorage.getItem('student')));
        this.student = this.studentSubject.asObservable();

    }

 
    public get studentValue(): Csgi_student {
        return this.studentSubject.value;
    }



    register(student: Csgi_student) {
        return this.http.post(`${environment.apiUrl}/api/student`, student);
    }

    getAll() {
  //       alert('on getAll service')
       // alert(JSON.stringify(this.http.get<Csgi_student[]>(`${environment.apiUrl}/api/student`)));
       // return this.http.get<Csgi_student[]>(`${environment.apiUrl}/api/student`);
       return this.http.get<Csgi_student[]>(`${environment.apiUrl}/api/student`)
       /*.pipe(
        map((data: any) => {
           // alert('on Get Students'+JSON.stringify(data));
          return data;
        }), catchError( error => {
          return throwError( 'Something went wrong!' );
        })
     )*/
       

       // return response;
    }

    getStudents() {
        return this.http.get(`${environment.apiUrl}/api/student`).
            pipe(
               map((student: Csgi_student[]) => {
                 //  alert('on Get Students'+JSON.stringify(data));
                 return JSON.stringify(student);
               }), catchError( error => {
                 return throwError( 'Something went wrong!' );
               })
            )
        }
    

    getById(id: string) {
        alert('update for ID: '+id)
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
             /*   if (id == this.studentValue.studentid) {
                    this.logout();
                }*/
                return x;
            }));
      
              
    }
}