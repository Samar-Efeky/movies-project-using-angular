// src/app/services/chat.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private base = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  askGemini(prompt: string) {
    const body = {
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ]
    };
    return this.http.post(`${this.base}/gemini/generate`, body);
  }
}
