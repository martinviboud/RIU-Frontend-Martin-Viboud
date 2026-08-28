
import { Component, OnInit, ChangeDetectionStrategy, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Appearance, Gender, Hero, Powerstats, Biography, Images } from '../interfaces/hero.interface';
import { HeroesService } from '../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, finalize } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UpperCaseDirective } from '../directives/upper-case.directive';




@Component({
    selector: 'app-new-page',
    templateUrl: './new-page.component.html',
    styleUrls: ['./new-page.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: true,
    imports: [
      MatFormFieldModule, MatInputModule, MatSelectModule, MatSliderModule,
      MatIconModule, MatButtonModule, MatDividerModule, MatProgressSpinnerModule,
      ReactiveFormsModule, UpperCaseDirective
    ]
})
export class NewPageComponent implements OnInit {

  private readonly heroesService = inject(HeroesService);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly snackbar = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);
  
  get isLoading(){
    return this.heroesService.isLoading;
  }
  
  heroForm = new FormGroup({
    id: new FormControl<number | null>(null),
    name: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(2)] }),
    gender: new FormControl<Gender | ''>(''),
    publisher: new FormControl('', { nonNullable: true }),
    fullName: new FormControl('', { nonNullable: true }),
    placeOfBirth: new FormControl('', { nonNullable: true }),
    intelligence: new FormControl(0, { nonNullable: true }),
    strength: new FormControl(0, { nonNullable: true }),
    speed: new FormControl(0, { nonNullable: true }),
    durability: new FormControl(0, { nonNullable: true }),
    power: new FormControl(0, { nonNullable: true }),
    img: new FormControl('/assets/no-image.png', { nonNullable: true }),
    combat: new FormControl(0, { nonNullable: true })
  })
  
  ngOnInit(): void {
    if ( !this.router.url.includes('edit') ) return;

    this.activatedRoute.params.pipe(
      switchMap( ({ id }) => this.heroesService.getHeroById( id ) ),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe( hero =>{
      if(!hero) return this.router.navigateByUrl('/');
      
      this.heroForm.setValue({
        id: hero.id,
        name: hero.name,
        gender: hero.appearance.gender,
        publisher: hero.biography.publisher ?? '',
        fullName: hero.biography.fullName,
        placeOfBirth: hero.biography.placeOfBirth,
        intelligence: hero.powerstats.intelligence,
        strength: hero.powerstats.strength,
        speed: hero.powerstats.speed,
        durability: hero.powerstats.durability,
        power: hero.powerstats.power,
        combat: hero.powerstats.combat,
        img: hero.images.md
      });
      return
    })
  }

  formatLabel(value: number): string{
    return `${value}`;
  }
  get currentHero():Hero  {

    const {
      intelligence, strength, speed, durability, power, combat, gender, fullName, placeOfBirth, publisher,
      name, id, img
    } = this.heroForm.getRawValue();

    const powerstats: Powerstats = { intelligence, strength, speed, durability, power, combat };
    const appearance: Appearance = { gender: gender as Gender };
    const biography: Biography = { fullName, placeOfBirth, publisher };
    const images: Images = { md: img };
    const hero: Hero = { id: id ?? 0, name, powerstats, appearance, biography, images };

    return hero;
  }
  

  onSubmit(){
    if (this.heroForm.invalid) {
      this.showSnackBar('¡Por lo menos dale un nombre a tu heroe!');
      this.heroForm.markAllAsTouched();
      return
    };

    if ( this.currentHero.id ) {
      this.heroesService.updateHero( this.currentHero ).pipe(
        finalize(()=> this.router.navigate(['layout/list']))
      )
        .subscribe( hero => {
          this.showSnackBar(`${ hero.name } actualizado!`);
         
        });
      return;
    }


    this.heroesService.newHero( this.currentHero ).pipe(
      finalize(()=> this.router.navigate(['layout/list']))
    )
      .subscribe( hero => {
        this.showSnackBar(`${ hero.name } creado!`);
        
      });
  }
  
  deleteHero(){
    this.heroesService.deleteHero(this.currentHero);
  }

  showSnackBar(message: string):void{
      this.snackbar.open(message, 'done',{
        duration: 3000
      })
  }

  goBack(){
    this.router.navigateByUrl('/layout/list');
  }
}
