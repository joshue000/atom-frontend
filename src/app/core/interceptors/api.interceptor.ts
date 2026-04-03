import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { StorageService } from '../services/storage.service';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const storage = inject(StorageService);
  const userId = storage.getUserId();

  if (userId) {
    const cloned = req.clone({
      setHeaders: { 'x-user-id': userId },
    });
    return next(cloned);
  }

  return next(req);
};
