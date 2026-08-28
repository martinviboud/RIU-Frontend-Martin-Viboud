# PruebaTecnicaRIU

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.1.4.

## Instalar paquetes y dependencias

Luego de clonar el repositorio instalar los modulos corriendo el comando `npm install`.

## Levantar el proyecto de manera local

En el directorio del proyecto correr el comando `ng serve` y navegar a  `http://localhost:4200/`. La aplicación se va a recargar cada ves que se guarde algun cambio.

## Levantar el mockserver

En el directorio del proyecto correr el comando `npm run mockserver`. La aplicación va a consumir directamente los datos de `http://localhost:3000/`.

## Levantar todo con Docker

Con Docker Desktop corriendo, el comando `npm run docker:up` levanta la app (`http://localhost:8080`) y el mockserver (`http://localhost:3000`) juntos, sin necesidad de instalar dependencias localmente. Para bajarlos: `npm run docker:down`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

