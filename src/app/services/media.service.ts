// src/app/services/media.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MediaService {
  constructor(private http: HttpClient) {}

  getMediaCollection(media: string, category: string, pageNumber: string): Observable<any> {
    return this.http.get<any>(`/api/tmdb?action=collection&media=${media}&category=${category}&page=${pageNumber}`);
  }

  getTrending(media: string, pageNumber: string): Observable<any> {
    return this.http.get<any>(`/api/tmdb?action=trending&media=${media}&page=${pageNumber}`);
  }

  searchMulti(query: string, pageNumber: string = '1'): Observable<any> {
    return this.http.get<any>(`/api/tmdb?action=search&query=${encodeURIComponent(query)}&page=${pageNumber}`);
  }
}
