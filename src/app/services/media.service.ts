import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MediaService {
  constructor(private http: HttpClient) {}
  getMediaCollection(media: string, category: string, pageNumber = '1'): Observable<any> {
    return this.http.get<any>(`/api/tmdb/collection?media=${media}&category=${category}&page=${pageNumber}`);
  }
  getTrending(media: string, category: string, pageNumber = '1'): Observable<any> {
    // call the same endpoint with category e.g. 'trending' if needed or create separate endpoint
    return this.http.get<any>(`/api/tmdb/collection?media=${media}&category=${category}&page=${pageNumber}`);
  }
  searchMulti(query: string, pageNumber = '1'): Observable<any> {
    return this.http.get<any>(`/api/tmdb/search?query=${encodeURIComponent(query)}&page=${pageNumber}`);
  }
}
