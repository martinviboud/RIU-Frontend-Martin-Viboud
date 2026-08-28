import { Component, input, output, ChangeDetectionStrategy, inject } from '@angular/core';
import { Hero } from '../interfaces/hero.interface';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../material/material.module';


@Component({
    selector: 'app-hero-card',
    templateUrl: './hero-card.component.html',
    styleUrls: ['./hero-card.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: true,
    imports: [MaterialModule, RouterModule]
})
export class HeroCardComponent {
  hero = input.required<Hero>();
  delete = output<Hero>();

  private readonly router = inject(Router);

  navigateToHero(){
      this.router.navigateByUrl(`/layout/${this.hero().id}`);
  }
  deleteHero(){
    this.delete.emit(this.hero());
  }
}
