import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  private headers = new HttpHeaders({
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiM2NmYTg5ZTdmNzNmOTI2Mzg4NmU4MjM4YzllZmYwMCIsIm5iZiI6MTcyNzA1MTc1My43MjE3MjcsInN1YiI6IjY2ZThkODllYjY2NzQ2ZGQ3OTBhOTAzZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.3De39_Q83wJNsQmhQVQzoMAh1WkAT6QxVizq24Mvlso',
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
