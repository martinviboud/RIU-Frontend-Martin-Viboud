import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { HeroInterceptor as HeroInterceptor } from './hero-interceptor.interceptor';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { HeroesService } from '../services/heroes.service';
import { delay, of } from 'rxjs';

describe('HeroInterceptor', () => {

  let interceptor: HttpInterceptor;
  let heroesServiceMock: jasmine.SpyObj<HeroesService>;


  beforeEach(() => {
    heroesServiceMock = jasmine.createSpyObj('HeroesService', ['isLoading'], { isLoading: true });
    TestBed.configureTestingModule({
    providers: [
      { provide: HeroesService, useValue: heroesServiceMock },
      { provide: HeroInterceptor, useClass: HeroInterceptor },
    ]
    });
    interceptor = TestBed.inject(HeroInterceptor);
  });

  it('should be created', () => {
    const interceptor: HeroInterceptor = TestBed.inject(HeroInterceptor);
    expect(interceptor).toBeTruthy();
  });

  it('debería configurar isLoading en true antes de la solicitud y en false después de la solicitud', () => {
    const requestMock: HttpRequest<unknown> = new HttpRequest('GET', 'https://google.com');
    const handlerMock: HttpHandler = {
      handle: () => {
        return of({} as HttpEvent<unknown>).pipe(delay(500));
      },
    };

    interceptor.intercept(requestMock, handlerMock).subscribe(() => {
      expect(heroesServiceMock.isLoading).toBeTrue();


      expect(heroesServiceMock.isLoading).toBeFalse();
    });
  });

  it('debería configurar isLoading en true antes de la solicitud y en false cuando finaliza', fakeAsync(() => {
    Object.defineProperty(heroesServiceMock, 'isLoading', { value: false, writable: true, configurable: true });

    const requestMock: HttpRequest<unknown> = new HttpRequest('GET', 'https://google.com');
    const handlerMock: HttpHandler = {
      handle: () => of({} as HttpEvent<unknown>).pipe(delay(500)),
    };

    interceptor.intercept(requestMock, handlerMock).subscribe();
    expect(heroesServiceMock.isLoading).toBeTrue();

    tick(1000);
    expect(heroesServiceMock.isLoading).toBeFalse();
  }));
});
