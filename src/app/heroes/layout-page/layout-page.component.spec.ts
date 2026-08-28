import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutPageComponent } from './layout-page.component';
import { MaterialModule } from 'src/app/material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

describe('LayoutPageComponent', () => {
  let component: LayoutPageComponent;
  let fixture: ComponentFixture<LayoutPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LayoutPageComponent, MaterialModule, BrowserAnimationsModule, RouterTestingModule]
    });
    fixture = TestBed.createComponent(LayoutPageComponent);
    component = fixture.componentInstance;
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

 
});
