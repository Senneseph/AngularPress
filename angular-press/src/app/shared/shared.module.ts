import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileSizePipe } from './pipes/file-size.pipe';

@NgModule({
  imports: [
    CommonModule,
    FileSizePipe
  ],
  exports: [
    CommonModule,
    FileSizePipe
  ]
})
export class SharedModule { }
