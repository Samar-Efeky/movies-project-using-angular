// Component to show loading overlay
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoadingService } from '../services/loading-service';

@Component({
  selector: 'app-loading-component',
  standalone: true,
  templateUrl: './loading-component.html',
  styleUrl: './loading-component.css'
})
export class LoadingComponent implements OnInit, OnDestroy {
  isLoading = false;
  private subscription!: Subscription; // store subscription to unsubscribe later

  constructor(private loadingService: LoadingService) {}

  ngOnInit(): void {
    // Subscribe to loading state
    this.subscription = this.loadingService.isLoading$.subscribe(status => {
      this.isLoading = status;
    });
  }

  ngOnDestroy(): void {
    // Prevent memory leaks
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
