// src/app/services/media.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  private base = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getMediaCollection(media: string, category: string, pageNumber: string) {
    return this.http.get<any>(`${this.base}/tmdb/${media}/${category}?language=en-US&page=${pageNumber}`);
  }

  getTrending(media: string, category: string, pageNumber: string) {
    return this.http.get<any>(`${this.base}/tmdb/${media}/${category}/day?language=en-US&page=${pageNumber}`);
  }

  searchMulti(query: string, pageNumber: string = '1') {
    return this.http.get<any>(`${this.base}/tmdb/search/multi?query=${encodeURIComponent(query)}&language=en-US&page=${pageNumber}`);
  }
}
