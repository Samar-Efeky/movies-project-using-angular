import { inject, Injectable } from '@angular/core';
import { collectionData,  Firestore } from '@angular/fire/firestore';
import { addDoc, collection, deleteDoc, doc } from 'firebase/firestore';
import {Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private db = inject(Firestore);

  // إضافة عنصر للـ history
  addToHistory(uid: string, data: { id: string; title: string; imageUrl: string; type: string }) {
    const historyRef = collection(this.db, `users/${uid}/history`);
    const openedAt = new Date().toISOString();
    return addDoc(historyRef, { ...data, openedAt });
  }

  // جلب كل العناصر
  getHistory(uid: string): Observable<any[]> {
    const historyRef = collection(this.db, `users/${uid}/history`);
    return collectionData(historyRef, { idField: 'docId' }) as Observable<any[]>;
  }

  // حذف عنصر من الـ history
  removeFromHistory(uid: string, docId: string) {
    const itemRef = doc(this.db, `users/${uid}/history/${docId}`);
    return deleteDoc(itemRef);
  }
}