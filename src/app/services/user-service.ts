import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Auth, authState, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signOut, user, User } from '@angular/fire/auth';
import { docData, Firestore } from '@angular/fire/firestore';
import { onAuthStateChanged, signInWithPopup } from 'firebase/auth';
import { arrayRemove, arrayUnion, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { BehaviorSubject, from, map, Observable, of, switchMap } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private auth = inject(Auth);
  private db = inject(Firestore);
  private user$: Observable<User | null>;

  constructor() {
    this.user$ = authState(this.auth);
  }

  get currentUser$() {
    return this.user$;
  }

  isLoggedIn(): Observable<boolean> {
    return this.currentUser$.pipe(map(user => !!user));
  }

  signUp(data: { email: string; password: string; name: string; age: number; imageUrl: string }) {
    return from(createUserWithEmailAndPassword(this.auth, data.email, data.password)).pipe(
      switchMap(cred => {
        const profile = {
          uid: cred.user.uid,
          email: data.email,
          name: data.name,
          age: data.age,
          imageUrl: data.imageUrl
        };
        return setDoc(doc(this.db, 'users', cred.user.uid), profile);
      })
    );
  }

  signIn(email: string, password: string) {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }
  logout() {
    return from(signOut(this.auth));
  }

  getUserData(uid: string) {
    return from(getDoc(doc(this.db, 'users', uid)));
  }

  updateProfileImage(file: File, uid: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64 = reader.result as string;
          const userRef = doc(this.db, 'users', uid);
          await updateDoc(userRef, { imageUrl: base64 });
          resolve(base64);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }
}