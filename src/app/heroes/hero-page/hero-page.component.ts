import { Component, OnInit, ChangeDetectionStrategy, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HeroesService } from '../services/heroes.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Hero } from '../interfaces/hero.interface';
import { switchMap } from 'rxjs';
import { MaterialModule } from '../../material/material.module';
import { GenderPipe } from '../pipes/gender.pipe';


@Component({
    selector: 'app-hero-page',
    templateUrl: './hero-page.component.html',
    styleUrls: ['./hero-page.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: true,
    imports: [MaterialModule, RouterModule, GenderPipe]
})
export class HeroPageComponent implements OnInit {

    hero?: Hero ;
    private readonly heroesService = inject(HeroesService);
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
      this.activatedRoute.params
      .pipe(
        switchMap( ({ id }) => this.heroesService.getHeroById( id )),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe( hero => {

        if ( !hero ) return this.router.navigate([ '/layout/list' ]);

        this.hero = hero;
        return;
      })
  }

  get isLoading(){
    return this.heroesService.isLoading;
  }
  goBack(){
    this.router.navigateByUrl('/layout/list')
  }
}
