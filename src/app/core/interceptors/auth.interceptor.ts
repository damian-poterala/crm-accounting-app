import {
    HttpErrorResponse,
    HttpInterceptorFn
} from '@angular/common/http';

import { inject } from '@angular/core';
import { Router } from '@angular/router';

import {
    catchError,
    switchMap,
    throwError
} from 'rxjs';

import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

    const authService = inject(AuthService);
    const router = inject(Router);

    if (
        req.url.includes('/auth/login') ||
        req.url.includes('/auth/register') ||
        req.url.includes('/auth/refresh')
    ) {
        return next(req);
    }

    const token = authService.getAccessToken();

    const authReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

    return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
            console.log('STATUS: ', error.status);
            if (error.status !== 401) {
                return throwError(() => error);
            }

            console.log('ODPALAM REFRESH');

            return authService.refresh().pipe(
                switchMap((tokens) => {
                    authService.saveTokens(
                        tokens.accessToken,
                        tokens.refreshToken
                    );

                    const retryReq = req.clone({
                        setHeaders: {
                            Authorization: `Bearer ${tokens.accessToken}`
                        }
                    });

                    return next(retryReq);
                }),
                catchError((refreshError) => {
                    authService.clearTokens();
                    router.navigate(['/login']);
                    return throwError(() => refreshError);
                })
            );
        })
    );
};
