import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'genderPipe',
    standalone: true
})
export class GenderPipe implements PipeTransform {

  transform(gender: string): string {
    
      switch (gender) {
        case 'Male':
          return 'Hombre';
        case 'Female':
          return 'Mujer';
        case '-':
          return 'No Corresponde';
        default:
          return 'Género no especificado';
      }
    
  }

}
