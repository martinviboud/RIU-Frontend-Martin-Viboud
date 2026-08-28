import { GenderPipe } from './gender.pipe';

describe('GenderPipe', () => {
  it('create an instance', () => {
    const pipe = new GenderPipe();
    expect(pipe).toBeTruthy();
  });

  it('debería traducir "Male" a "Hombre"', () => {
    const pipe = new GenderPipe();
    expect(pipe.transform('Male')).toBe('Hombre');
  });

  it('debería traducir "Female" a "Mujer"', () => {
    const pipe = new GenderPipe();
    expect(pipe.transform('Female')).toBe('Mujer');
  });

  it('debería traducir "-" a "No Corresponde"', () => {
    const pipe = new GenderPipe();
    expect(pipe.transform('-')).toBe('No Corresponde');
  });

  it('debería devolver "Género no especificado" para un valor desconocido', () => {
    const pipe = new GenderPipe();
    expect(pipe.transform('otro')).toBe('Género no especificado');
  });
});
