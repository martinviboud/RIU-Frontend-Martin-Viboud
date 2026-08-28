import { Component, DebugElement, ChangeDetectionStrategy } from '@angular/core';
import { UpperCaseDirective } from './upper-case.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
    template: `
      <input type="text" [formControl]="inputValue" appUpperCase />  
  `,
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
class TestComponent {
  
  inputValue = new FormControl('');

}
describe('UpperCaseDirective', () => {

  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let inputEl: DebugElement;

  beforeEach(() => {
       TestBed.configureTestingModule({
         declarations: [TestComponent],
         imports:[ReactiveFormsModule, UpperCaseDirective]
       }).compileComponents();
  
       fixture = TestBed.createComponent(TestComponent);
       component = fixture.componentInstance;
        inputEl = fixture.debugElement.query(By.css('input'));
       
     });
  
   it('Deberia transformar el valor a Mayúscula', () => {
    const testInputValue = 'Manolo';
    
    component.inputValue.setValue(testInputValue);
    inputEl.nativeElement.value = testInputValue

    fixture.detectChanges();
    inputEl.triggerEventHandler('input', { target: inputEl.nativeElement });

    fixture.detectChanges();

    expect(inputEl.nativeElement.value).toBe(testInputValue.toUpperCase());
    expect(component.inputValue.value).toBe(testInputValue.toUpperCase());
   });
});


