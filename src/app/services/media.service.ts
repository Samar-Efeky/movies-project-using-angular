import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  private headers = new HttpHeaders({
    'Authorization': `Bearer ${environment.TMDB_API_TOKEN}`,
    'accept': 'application/json'
  });

  constructor(private http: HttpClient) {}

  getMediaCollection(media:string,category:string,pageNumber:string): Observable<any> {
    return this.http.get<any>(`https://api.themoviedb.org/3/${media}/${category}?language=en-US&page=${pageNumber}`, { headers: this.headers });
  }
  getTrending(media:string,category:string,pageNumber:string): Observable<any> {
    return this.http.get<any>(`https://api.themoviedb.org/3/${media}/${category}/day?language=en-US&page=${pageNumber}`, { headers: this.headers });
  }
  searchMulti(query: string, pageNumber: string = '1'): Observable<any> {
  return this.http.get<any>(`https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(query)}&language=en-US&page=${pageNumber}&include_adult=false`,
  { headers: this.headers });
}
}
