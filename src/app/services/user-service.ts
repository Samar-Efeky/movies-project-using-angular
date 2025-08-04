import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signOut, User } from '@angular/fire/auth';
import { signInWithPopup } from 'firebase/auth';
import { from, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UserService {
   private auth = inject(Auth); 

  constructor(private http: HttpClient) {}

  signUp(email: string, password: string): Observable<any> {
    return from(createUserWithEmailAndPassword(this.auth, email, password));
  }

  signIn(email: string, password: string): Observable<any> {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  signInWithGoogle(): Observable<any> {
    return from(signInWithPopup(this.auth, new GoogleAuthProvider()));
  }

  getCurrentUser() {
    return this.auth.currentUser;
  }

  logout(): Observable<any> {
    return from(this.auth.signOut());
  }
}
