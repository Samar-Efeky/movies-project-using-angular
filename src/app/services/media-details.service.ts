// src/app/services/media-details.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MediaDetailsService {
  private base = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getMediaDetails(media: string, mediaId: string) {
    return this.http.get<any>(`${this.base}/tmdb/${media}/${mediaId}?language=en-US`);
  }

  getMostDetails(media: string, mediaId: string, word: string) {
    return this.http.get<any>(`${this.base}/tmdb/${media}/${mediaId}/${word}?language=en-US`);
  }
}
