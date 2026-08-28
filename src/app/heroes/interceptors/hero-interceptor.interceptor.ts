import { Injectable, inject } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, delay, finalize } from 'rxjs';
import { HeroesService } from '../services/heroes.service';

@Injectable()
export class HeroInterceptor implements HttpInterceptor {

  private readonly heroesService = inject(HeroesService);

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.heroesService.isLoading = true;
    

    return next.handle(request).pipe(
      delay(500), // para simular el tiempo de espera
      finalize(() => {
        this.heroesService.isLoading = false; 
      })
    );
  }

}
