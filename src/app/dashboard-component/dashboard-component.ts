import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { MediaService } from '../services/media.service';
import { forkJoin, Subscription } from 'rxjs';
import { environment } from '../../environments/environment';
@Component({
  selector: 'app-dashboard-component',
  imports: [CommonModule, BaseChartDirective],
templateUrl: './dashboard-component.html',
  styleUrl: './dashboard-component.css'
})
export class DashboardComponent implements OnInit, OnDestroy {

  // Counters for statistics
  moviesCount = 0;
  seriesCount = 0;
  peopleCount = 0;

  // Data for the bar chart (Top 5 movies)
  topMoviesLabels: string[] = [];
  topMoviesPopularity: number[] = [];

  // Static data for the line chart (Monthly series release count)
  seriesMonthlyLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
  seriesMonthlyCount = [12, 19, 3, 5, 2, 3, 9]; 

  // Bar chart configuration
  barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { label: 'Popularity', data: [], backgroundColor: '#36a2eb' }
    ]
  };

  // Bar chart options (styling + responsiveness)
  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#f5f5f5' } },
      title: { display: true, text: 'Top 5 Popular Movies', color: '#f5f5f5' }
    },
    scales: {
      x: { ticks: { color: '#f5f5f5' }, grid: { color: '#333' } },
      y: { ticks: { color: '#f5f5f5' }, grid: { color: '#333' } }
    }
  };

  // Line chart configuration
  lineChartData: ChartData<'line'> = {
    labels: this.seriesMonthlyLabels,
    datasets: [
      { label: 'Series Released', data: this.seriesMonthlyCount, fill: false, borderColor: '#ff6384' }
    ]
  };

  // Line chart options
  lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#f5f5f5' } }
    },
    scales: {
      x: { ticks: { color: '#f5f5f5' }, grid: { color: '#333' } },
      y: { ticks: { color: '#f5f5f5' }, grid: { color: '#333' } }
    }
  };

  // Arrays to store active intervals and subscriptions for cleanup
  private timers: any[] = [];
  private subscriptions: Subscription[] = [];

  constructor(private mediaService: MediaService) {}

  // Animate counter from 0 to target value
  private animateCounter(property: 'moviesCount' | 'seriesCount' | 'peopleCount', targetValue: number) {
    let start = 0;
    const duration = 2000; // total animation time in ms
    const stepTime = Math.max(Math.floor(duration / targetValue), 20); // adjust step time

    const timer = setInterval(() => {
      if (start < targetValue) {
        start++;
        this[property] = start;
      } else {
        clearInterval(timer);
      }
    }, stepTime);

    this.timers.push(timer); // store timer for later cleanup
  }

  ngOnInit() {
   
    // Fetch movies data
    const moviesSub = forkJoin([
      this.mediaService.getMediaCollection('movie', 'popular', '1'),
      this.mediaService.getMediaCollection('movie', 'popular', '2'),
      this.mediaService.getMediaCollection('movie', 'popular', '3')
    ]).subscribe(responses => {
      const allMovies = responses.flatMap(res => res.results);
      this.animateCounter('moviesCount', allMovies.length);

      // Sort and get top 5 movies by popularity
      const topMovies = allMovies
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 5);

      this.topMoviesLabels = topMovies.map(m => m.title);
      this.topMoviesPopularity = topMovies.map(m => m.popularity);

      this.barChartData.labels = this.topMoviesLabels;
      this.barChartData.datasets[0].data = this.topMoviesPopularity;
    });
    this.subscriptions.push(moviesSub);

    // Fetch series data
    const seriesSub = forkJoin([
      this.mediaService.getMediaCollection('tv', 'popular', '1'),
      this.mediaService.getMediaCollection('tv', 'popular', '2'),
      this.mediaService.getMediaCollection('tv', 'popular', '3')
    ]).subscribe(responses => {
      const allSeries = responses.flatMap(res => res.results);
      this.animateCounter('seriesCount', allSeries.length);
    });
    this.subscriptions.push(seriesSub);

    // Fetch people data
    const peopleSub = forkJoin([
      this.mediaService.getMediaCollection('person', 'popular', '1'),
      this.mediaService.getMediaCollection('person', 'popular', '2'),
      this.mediaService.getMediaCollection('person', 'popular', '3')
    ]).subscribe(responses => {
      const allPeople = responses.flatMap(res => res.results);
      this.animateCounter('peopleCount', allPeople.length);
    });
    this.subscriptions.push(peopleSub);
  }

  ngOnDestroy() {
    // Clear all active intervals
    this.timers.forEach(timer => clearInterval(timer));

    // Unsubscribe from all active subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
