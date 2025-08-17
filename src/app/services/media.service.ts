import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  private baseUrl = 'https://your-app.vercel.app/api/tmdb'; // 👈 عدل URL باسم مشروعك على Vercel

  constructor(private http: HttpClient) {}

  getMediaCollection(media: string, category: string, pageNumber: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}`, {
      params: {
        action: 'collection',
        media,
        category,
        page: pageNumber
      }
    });
  }

  getTrending(media: string, category: string, pageNumber: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}`, {
      params: {
        action: 'trending',
        media,
        category,
        page: pageNumber,
        time_window: 'day'
      }
    });
  }

  searchMulti(query: string, pageNumber: string = '1'): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}`, {
      params: {
        action: 'search',
        query,
        page: pageNumber
      }
    });
  }

  getMediaDetails(media: string, id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}`, {
      params: {
        action: 'details',
        media,
        id
      }
    });
  }

  getMostDetails(media: string, id: string, word: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}`, {
      params: {
        action: 'extra',
        media,
        id,
        word
      }
    });
  }
}
