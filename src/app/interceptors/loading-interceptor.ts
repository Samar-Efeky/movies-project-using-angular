// Interceptor to show loading when request starts and hide when it ends
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoadingService } from '../services/loading-service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  loadingService.show(); // turn loading on before request

  return next(req).pipe(
    finalize(() => loadingService.hide()) // turn loading off when finished
  );
};
