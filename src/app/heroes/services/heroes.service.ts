import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Hero } from '../interfaces/hero.interface';
import { Observable, catchError, filter, map, of, switchMap, finalize } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../environments/environment';



@Injectable({ providedIn: 'root' })
export class HeroesService {

  isLoading = false;

    private readonly http = inject(HttpClient);
    private readonly dialog = inject(MatDialog);
    private readonly router = inject(Router);
    private readonly snackbar = inject(MatSnackBar);
    private readonly baseUrl = `${environment.apiUrl}/heroes`;

    getHeroes(page?: number, limit?: number): Observable<Hero[]>{

      if(limit && page){
        return this.http.get<Hero[]>(`${this.baseUrl}?_page=${page}&_limit=${limit}`)
      }
      else{
        return this.http.get<Hero[]>(this.baseUrl)
      }
    }

    getHeroById( id: string ): Observable<Hero|undefined> {
        return this.http.get<Hero>(`${this.baseUrl}/${ id }`)
          .pipe(
            catchError( error => of(undefined) )
          );
    }
    searchHero(query: string): Observable<Hero[]>{
        return this.http.get<Hero[]>(`${this.baseUrl}?name_like=${ query }&_limit=10`);
    }

    newHero(hero: Hero):Observable<Hero>{
        return this.http.post<Hero>(this.baseUrl, hero);
    }

    updateHero(hero: Hero):Observable<Hero>{
      if( !hero.id ) throw Error('ID is required')
      return this.http.patch<Hero>(`${this.baseUrl}/${hero.id}`, hero);
    }

    deleteHero(hero: Hero):void{

      const dialogRef = this.dialog.open( ConfirmDialogComponent, {
        data: hero
      });

      dialogRef.afterClosed().pipe(
        filter( (result: boolean) => result ),
        switchMap( () => this.confirmDelete( hero.id )),
        filter( (wasDeleted: boolean) => wasDeleted ),
      )
      .subscribe(() => {
        this.showSnackBar('Superheroe eliminado con éxito');
        this.router.navigate(['/heroes']);
      });

    }
    
    confirmDelete(id: number){
      return this.http.delete(`${this.baseUrl}/${ id }`)
      .pipe(
        map( resp => true ),
        catchError( err => of(false) )  
      );
      
    }

    showSnackBar(message: string):void{
      this.snackbar.open(message, 'done',{
        duration: 3000
      })
    }
}