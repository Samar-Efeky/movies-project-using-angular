import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../services/chat-service';
import { MediaService } from '../services/media.service';
import { Router } from '@angular/router';
import { slideDownUp } from '../animations/animations';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-component.html',
  styleUrls: ['./chat-component.css'],
  animations: [slideDownUp]
})
export class ChatComponent implements OnInit, OnDestroy {
  // Whether the chat box is open or not
  isChatOpen = false;

  // Show the small hint above the chat button
  showHint = false;

  // List of messages between user and bot
  messages: { sender: string; text: string }[] = [];

  // Input text from the user
  userInput = '';

  // Interval ID for typing animation
  typingInterval: any;

  // Store all subscriptions to unsubscribe later
  private subscriptions: Subscription[] = [];

  constructor(
    private _chatservice: ChatService, // For AI chat requests
    private _mediaService: MediaService, // For searching movies/shows
    private _router: Router // For navigation
  ) {
    // Add first welcome message from bot
    this.messages.push({ sender: 'bot', text: '👋 How can I help you?' });
  }

  // Function to show hint + play sound
  private showHintWithSound = () => {
    setTimeout(() => {
      this.showHint = true;
      this.playHintSound();
    }, 1000);
    // Remove listeners after first trigger
    document.removeEventListener('click', this.showHintWithSound);
    document.removeEventListener('keydown', this.showHintWithSound);
  };

  ngOnInit() {
    // Add event listeners to detect first user interaction
    document.addEventListener('click', this.showHintWithSound);
    document.addEventListener('keydown', this.showHintWithSound);
  }

  ngOnDestroy() {
    // Clear typing animation
    if (this.typingInterval) {
      clearInterval(this.typingInterval);
    }

    // Unsubscribe from all active subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());

    // Remove event listeners
    document.removeEventListener('click', this.showHintWithSound);
    document.removeEventListener('keydown', this.showHintWithSound);
  }

  // Play hint sound
  playHintSound() {
    const audio = new Audio('assets/sound/new-message.mp3');
    audio.play().catch(err => console.warn('Audio play blocked:', err));
  }

  // Open/close the chat box
  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
  }

  // Send user message to AI
  sendMessage() {
    if (!this.userInput.trim()) return; // Ignore empty messages

    const userMessage = this.userInput;
    this.messages.push({ sender: 'user', text: userMessage });
    this.userInput = '';

    // Temporary loading message
    this.messages.push({ sender: 'bot', text: 'Loading...' });

    // Call AI service
    const sub = this._chatservice
      .askGemini(
        userMessage +
          '\nPlease return the list of movies, TV shows, or people, with each item on a new line.'
      )
      .subscribe({
        next: (res: any) => {
          // Extract reply text
          const reply =
            res?.candidates?.[0]?.content?.parts?.[0]?.text ||
            'Sorry, I did not understand your question.';

          // Replace "Loading..." with typing animation
          const lastMsgIndex = this.messages.length - 1;
          this.messages[lastMsgIndex].text = '';
          this.typeReply(reply);

          // Hide hint if visible
          if (this.showHint) {
            this.showHint = false;
          }
        },
        error: (err) => {
          console.error(err);
          this.messages.push({
            sender: 'bot',
            text: '⚠ Error connecting to the service.'
          });
        }
      });

    // Save subscription for cleanup
    this.subscriptions.push(sub);
  }

  // Simulate typing animation for bot reply
  typeReply(fullText: string) {
    let index = 0;
    const lastMsgIndex = this.messages.length - 1;
    clearInterval(this.typingInterval);

    this.typingInterval = setInterval(() => {
      if (index < fullText.length) {
        this.messages[lastMsgIndex].text += fullText[index];
        index++;
      } else {
        clearInterval(this.typingInterval);
      }
    }, 30);
  }

  // Search media and navigate to details
  searchAndGo(query: string) {
    const sub = this._mediaService.searchMulti(query).subscribe((res) => {
      if (res.results && res.results.length > 0) {
        const first = res.results[0];
        this.goToMediaDetails(first.media_type, first.id);
        this.toggleChat();
      } else {
        console.log('No results found for:', query);
      }
    });

    this.subscriptions.push(sub);
  }

  // Detect if message contains a list of media items
  isListMessage(text: string): boolean {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l);
    return lines.length > 3 && lines.some(line =>
      /movie|film|series|show|season|episode|person|actor|actress/i.test(line)
    );
  }

  // Navigate to media details page
  goToMediaDetails(mediaType: string, mediaId: string): void {
    if (mediaType === 'person') {
      this._router.navigate(['person-details', mediaType, mediaId]);
    } else {
      this._router.navigate(['media-details', mediaType, mediaId]);
    }
  }
}
