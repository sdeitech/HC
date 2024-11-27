import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule
  ]
})
export class CoreServicesModule { }
export * from './core-services.module';
export * from './guards';
export * from './models';
export * from './modules';
export * from './services';
export * from './pipes';
