import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MediaDetailsService {
  private headers = new HttpHeaders({
    'Authorization': `Bearer ${environment.TMDB_API_TOKEN}`,
      'accept': 'application/json'
    });
    constructor(private http: HttpClient) {}
     getMediaDetails(media:string, mediaId:string):Observable<any>{
    return this.http.get<any>(`https://api.themoviedb.org/3/${media}/${mediaId}?language=en-US`,{ headers: this.headers });
  }
  getMostDetails(media:string, mediaId:string, word:string):Observable<any>{
    return this.http.get<any>(`https://api.themoviedb.org/3/${media}/${mediaId}/${word}?language=en-US`,{ headers: this.headers });
  }
}
