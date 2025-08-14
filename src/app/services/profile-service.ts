import { inject, Injectable } from '@angular/core';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { addDoc, collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // Service available everywhere in the app
})
export class ProfileService {
  private db = inject(Firestore); // Firestore database instance

  // Add a new history item for a user
  addToHistory(uid: string, data: { id: string; title: string; imageUrl: string; type: string }) {
    const historyRef = collection(this.db, `users/${uid}/history`);
    const openedAt = new Date().toISOString(); // Current timestamp
    return addDoc(historyRef, { ...data, openedAt });
  }

  // Get all history items for a user
  getHistory(uid: string): Observable<any[]> {
    const historyRef = collection(this.db, `users/${uid}/history`);
    return collectionData(historyRef, { idField: 'docId' }) as Observable<any[]>;
  }

  // Remove a specific history item for a user
  removeFromHistory(uid: string, docId: string) {
    const itemRef = doc(this.db, `users/${uid}/history/${docId}`);
    return deleteDoc(itemRef);
  }
  clearHistory(uid: string) {
  const historyRef = collection(this.db, `users/${uid}/history`);

  return getDocs(historyRef).then(snapshot => {
    const deletePromises = snapshot.docs.map(docSnap => 
      deleteDoc(doc(this.db, `users/${uid}/history/${docSnap.id}`))
    );

    return Promise.all(deletePromises); 
  });
}
}
