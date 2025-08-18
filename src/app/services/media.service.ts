import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MediaService {
  constructor(private http: HttpClient) {}

  getMediaCollection(media: string, category: string, pageNumber = '1'): Observable<any> {
    return this.http.get<any>(
      `/api/tmdb/collection?media=${media}&category=${category}&page=${pageNumber}`
    );
  }

  getTrending(category = 'all', pageNumber = '1', time = 'day'): Observable<any> {
    return this.http.get<any>(
      `/api/tmdb/trending?category=${category}&page=${pageNumber}&time=${time}`
    );
  }

  searchMulti(query: string, pageNumber = '1'): Observable<any> {
    return this.http.get<any>(
      `/api/tmdb/search?query=${encodeURIComponent(query)}&page=${pageNumber}`
    );
  }
}