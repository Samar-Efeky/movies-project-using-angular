import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiKey = environment.geminiApiKey;
  // ✅ النموذج الصح من Google AI Studio
  private endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

  constructor(private http: HttpClient) {}

  askGemini(prompt: string) {
    const body = {
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ]
    };
    return this.http.post(`${this.endpoint}?key=${this.apiKey}`, body);
  }
}
