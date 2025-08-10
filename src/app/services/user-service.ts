import { inject, Injectable } from '@angular/core';
import { Auth, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { from, map, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root' // Service available across the whole app
})
export class UserService {
  private auth = inject(Auth); // Firebase Authentication instance
  private db = inject(Firestore); // Firestore database instance
  private user$: Observable<User | null>;

  constructor() {
    this.user$ = authState(this.auth); // Tracks authentication state changes
  }

  // Returns an observable for the current user
  get currentUser$() {
    return this.user$;
  }

  // Checks if the user is logged in
  isLoggedIn(): Observable<boolean> {
    return this.currentUser$.pipe(map(user => !!user));
  }

  // Sign up a new user and store profile data in Firestore
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

  // Sign in an existing user
  signIn(email: string, password: string) {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  // Log out the current user
  logout() {
    return from(signOut(this.auth));
  }

  // Get user profile data from Firestore
  getUserData(uid: string) {
    return from(getDoc(doc(this.db, 'users', uid)));
  }

  // Update profile image with a base64 string
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
      reader.readAsDataURL(file); // Reads file as Base64
    });
  }
}
