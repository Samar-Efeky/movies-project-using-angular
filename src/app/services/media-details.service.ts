// src/app/services/media-details.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MediaDetailsService {
  constructor(private http: HttpClient) {}

  getMediaDetails(media: string, mediaId: string): Observable<any> {
    return this.http.get<any>(`/api/tmdb?action=details&media=${media}&id=${mediaId}`);
  }

  getMostDetails(media: string, mediaId: string, word: string): Observable<any> {
    return this.http.get<any>(`/api/tmdb?action=extra&media=${media}&id=${mediaId}&word=${word}`);
  }
}
