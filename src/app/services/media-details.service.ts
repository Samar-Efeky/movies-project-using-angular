import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MediaDetailsService {
  constructor(private http: HttpClient) {}
  getMediaDetails(media: string, mediaId: string): Observable<any> {
    return this.http.get<any>(`/api/tmdb/details?media=${media}&id=${mediaId}`);
  }
  getMostDetails(media: string, mediaId: string, word: string): Observable<any> {
    return this.http.get<any>(`/api/tmdb/details?media=${media}&id=${mediaId}&word=${word}`);
  }
}
