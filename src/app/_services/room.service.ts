import { ErrorHandler, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, pipe } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { map, catchError, first } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { Csgi_rooms, User } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class RoomService {
    private roomSubject: BehaviorSubject<Csgi_rooms>;
    private userSubject: BehaviorSubject<User>;
    public room: Observable<Csgi_rooms>;
    public user: Observable<User>;

    stringifiedData: any;  
    parsedJson: any; 
   

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
        this.user = this.userSubject.asObservable();
        this.roomSubject = new BehaviorSubject<Csgi_rooms>(JSON.parse(localStorage.getItem('room')));
        this.room = this.roomSubject.asObservable();

    }

    public get userValue(): User {
        return this.userSubject.value;
    }

    public get roomValue(): Csgi_rooms {
        return this.roomSubject.value;
    }


    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.router.navigate(['/account/login']);
    }

    register(room: Csgi_rooms) {
        return this.http.post(`${environment.apiUrl}/api/room`, room);
    }

    getAll() {
        return this.http.get<Csgi_rooms[]>(`${environment.apiUrl}/api/room`);
    }

    getById(id: string) {
        return this.http.get<Csgi_rooms>(`${environment.apiUrl}/api/room/${id}`);
    }

    update(id, params) {
        alert(id);
        return this.http.put(`${environment.apiUrl}/api/room/${id}`, params)
            .pipe(map(x => {
                // update stored user if the logged in user updated their own record
                if (id == this.roomValue.roomid) {
                    // update local storage
                    const room = { ...this.roomValue, ...params };
                    localStorage.setItem('room', JSON.stringify(room));

                    // publish updated user to subscribers
                    this.roomSubject.next(room);
                }
                return x;
            }));
    }


    // not allowing deletion for rooms by teacher
    delete(id: string) {
        return this.http.delete(`${environment.apiUrl}/api/room/${id}`)
            .pipe(map(x => {
                // auto logout if the logged in user deleted their own record
                if (id == this.roomValue.roomid) {
                    this.logout();
                }
                alert(JSON.stringify(x));
                return x;
            }));
      
              
    }
}