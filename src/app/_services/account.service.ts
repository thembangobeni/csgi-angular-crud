import { ErrorHandler, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, pipe } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { map, catchError, first } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { User } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class AccountService {
    private userSubject: BehaviorSubject<User>;
    public user: Observable<User>;
    stringifiedData: any;  
    parsedJson: any; 
    //public userRespose:Observable<[]>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
        this.user = this.userSubject.asObservable();
    }

    public get userValue(): User {
        return this.userSubject.value;
    }

   /* public get userKey(): User {
        return this.userSubject.getValue();
    }*/
    
  
    login(username, password) {
      //  return this.http.post<User>(`${environment.apiUrl}/api/authenticate`, { username, password })
      const headers = { 'content-type': 'application/json'}  //not used for now
      const body={ username, password }
     // alert('on Login: '+body.username + ' Password: '+body.password);
     // alert(this.http.post(`${environment.apiUrl}/api/authenticate`, { username, password },{'headers':headers , observe: 'response'})
      return this.http.post<any>(`${environment.apiUrl}/api/authenticate`, { username, password })
                                    .pipe(
                                        map((data) => {
                                          //You can perform some transformation here
                                        let token    = data.token;
                                        let email    = data.response.email;
                                        let userid   = data.response.userid;
                                        let username = data.response.username;
                                        let Password = data.response.password;
                                        let UserObject = {userid, username, email, password, token}
                                        // Object data  
                                        //console.log(data);  
                                       // alert('Token: '+token);
                                      //  alert('email: '+email+ ' FirstName: '+userid+ '\n LastName: '+ username+ ' Password: '+Password);
                                        // Convert to JSON  
                                      //  this.stringifiedData = JSON.stringify(UserObject); 
                                      //  alert(this.stringifiedData); 
                                        //console.log("With Stringify :" , this.stringifiedData);  
                                       // alert(this.parsedJson.response);
                                        // Parse from JSON  
                                       // this.parsedJson = JSON.parse(this.stringifiedData);  
                                       // alert(this.parsedJson.response);
                                       // console.log("With Parsed JSON :" , this.parsedJson);  
                                       //  alert('Response:'+ data.response);
                                         if (token && email){
                                        // return this.http.post<any>(`${environment.apiUrl}/api/authenticate`, { username, password })
                                         localStorage.setItem('user', JSON.stringify(UserObject));
                                         this.userSubject.next(UserObject);
                                         return UserObject;
                                        }
                                       
                                       }),
                                       catchError((err) => {
                                       // alert(err);
                                         console.error(err);
                                         throw 'invalid username or password provided.';
                                        }));
                                       
                                    }


    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.router.navigate(['/account/login']);
    }

    register(user: User) {
        return this.http.post(`${environment.apiUrl}/api/register`, user);
    }

    getAll() {
        return this.http.get<User[]>(`${environment.apiUrl}/api/users`);
    }

    getById(id: string) {
        return this.http.get<User>(`${environment.apiUrl}/api/users/${id}`);
    }

    update(id, params) {
        return this.http.put(`${environment.apiUrl}/api/users/${id}`, params)
            .pipe(map(x => {
                // update stored user if the logged in user updated their own record
                if (id == this.userValue.userid) {
                    // update local storage
                    const user = { ...this.userValue, ...params };
                    localStorage.setItem('user', JSON.stringify(user));

                    // publish updated user to subscribers
                    this.userSubject.next(user);
                }
                return x;
            }));
    }


    // not allowing deletion for users on teacher
    delete(id: string) {
        return this.http.delete(`${environment.apiUrl}/api/users/${id}`)
            .pipe(map(x => {
                // auto logout if the logged in user deleted their own record
                if (id == this.userValue.userid) {
                    this.logout();
                }
                return x;
            }));
      
              
    }
}