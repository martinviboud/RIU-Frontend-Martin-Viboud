import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { HeroesService } from '../services/heroes.service';
import { Hero } from '../interfaces/hero.interface';
import { PageEvent } from '@angular/material/paginator'
import { tap } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material/material.module';
import { HeroCardComponent } from '../hero-card/hero-card.component';



@Component({
    selector: 'app-list-page',
    templateUrl: './list-page.component.html',
    styleUrls: ['./list-page.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: true,
    imports: [MaterialModule, ReactiveFormsModule, HeroCardComponent]
})
export class ListPageComponent implements OnInit {
  heroes: Hero[] = [];
  totalHeroes: number = 0;
  searchControl = new FormControl('');
  private readonly heroesService = inject(HeroesService);
  ngOnInit(): void {
    this.getTotalHeroes()
    this.heroesService.getHeroes(1, 4).subscribe(heroes=>{
      this.heroes = heroes;
    })

  }

  get isLoading(){
    return this.heroesService.isLoading;
  }
  onPageChange(e: PageEvent ): void{
      this.heroesService.getHeroes(e.pageIndex + 1, e.pageSize).subscribe(heroes=>{
        this.heroes = heroes;
      })
  }

  getTotalHeroes(){
    this.heroesService.getHeroes().pipe(
      tap((heroes: Hero[])=>{
      this.totalHeroes = heroes.length;
      })
    ).subscribe();
  }

  preventDefault(event: KeyboardEvent){
    if(event.key === 'Enter'){
      event.preventDefault();
    }
  }

  searchHero(){
    const query = this.searchControl.value || '';
    if(query){
      this.heroesService.searchHero(query).subscribe(heroes =>{
        this.heroes = heroes;
      })
    }else{
      this.heroesService.getHeroes(1, 4).subscribe(heroes=>{
        this.heroes = heroes;
      })
    }
  }

  onDeleteHero(hero: Hero){
    this.heroesService.deleteHero(hero);
  }

}
