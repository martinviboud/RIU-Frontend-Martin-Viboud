import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDialogComponent } from './confirm-dialog.component';
import { MaterialModule } from 'src/app/material/material.module';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Gender, Hero } from '../interfaces/hero.interface';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;
  
  let dialogRefMock: jasmine.SpyObj<MatDialogRef<ConfirmDialogComponent>>;
  
  const mockHero: Hero = {
    "id": 1,
    "name": "A-Bomb",
    "powerstats": {
      "intelligence": 38,
      "strength": 100,
      "speed": 17,
      "durability": 80,
      "power": 24,
      "combat": 64
    },
    "appearance": {
      "gender": Gender.Male
    },
    "biography": {
      "fullName": "Richard Milhouse Jones",
      "alterEgos": "No alter egos found.",
      "placeOfBirth": "Scarsdale, Arizona",
      "publisher": "Marvel Comics"
    },
    "images": { 
      "md": "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/1-a-bomb.jpg"     
    }
  }
  beforeEach(() => {
    dialogRefMock = jasmine.createSpyObj('MatDialogRef', ['close']);
    TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent, MaterialModule],
      providers: [{ provide: MatDialogRef, useValue: dialogRefMock },
                  { provide: MAT_DIALOG_DATA, useValue: mockHero }]
    });
    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería cerrar el diálogo con valor false al llamar onNoClick()', () => {
    component.onNoClick();

    expect(dialogRefMock.close).toHaveBeenCalledWith(false);
  });

  it('debería cerrar el diálogo con valor true al llamar onConfirm()', () => {
    component.onConfirm();

    expect(dialogRefMock.close).toHaveBeenCalledWith(true);
  });
});
