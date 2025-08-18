// Interceptor to show loading when request starts and hide when it ends
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoadingService } from '../services/loading-service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  // ✅ skip loader for Gemini API requests and TMDB search
  const skipLoader =
    req.url.includes('/api/gemini') ||
    req.url.includes('/api/tmdb/search');

  if (skipLoader) {
    return next(req); // don't trigger loading
  }

  // Default: show loader
  loadingService.show();

  return next(req).pipe(
    finalize(() => loadingService.hide())
  );
};
