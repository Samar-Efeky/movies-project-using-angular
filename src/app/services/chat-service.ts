import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private endpoint = '/api/gemini';
  constructor(private http: HttpClient) {}
  askGemini(prompt: string) {
    return this.http.post<any>(this.endpoint, { prompt });
  }
}
