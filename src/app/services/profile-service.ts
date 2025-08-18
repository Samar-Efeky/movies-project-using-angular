import { inject, Injectable } from '@angular/core';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { addDoc, collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // Service can be used everywhere
})
export class ProfileService {
  private db = inject(Firestore); // Firestore instance

  // Add item to user history (if not exists)
  async addToHistory(uid: string, data: { id: string; title: string; imageUrl: string; type: string }) {
    const historyRef = collection(this.db, `users/${uid}/history`);
    const q = query(
      historyRef,
      where('id', '==', data.id),
      where('type', '==', data.type)
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return null; // already exists
    }

    const openedAt = new Date().toISOString(); // add current time
    return addDoc(historyRef, { ...data, openedAt });
  }

  // Get all history items
  getHistory(uid: string): Observable<any[]> {
    const historyRef = collection(this.db, `users/${uid}/history`);
    return collectionData(historyRef, { idField: 'docId' }) as Observable<any[]>;
  }

  // Delete one history item
  removeFromHistory(uid: string, docId: string) {
    const itemRef = doc(this.db, `users/${uid}/history/${docId}`);
    return deleteDoc(itemRef);
  }

  // Clear all history items
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
