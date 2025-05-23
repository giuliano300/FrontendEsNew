import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectionSingleMultipleComponent } from '../../../component/selection-single-multiple/selection-single-multiple.component';
import { ProductTypes } from '../../../interfaces/EnumTypes';

@Component({
  selector: 'app-tipo-spedizione-lettera',
  imports: [ReactiveFormsModule, CommonModule, SelectionSingleMultipleComponent],
  templateUrl: './tipo-spedizione-lettera.component.html',
  styleUrl: './tipo-spedizione-lettera.component.scss'
})
export class TipoSpedizioneLetteraComponent {
  constructor() {}

  tipoProdotto: number = ProductTypes.LOL; 

  ngOnInit(): void{
    localStorage.setItem('productType', this.tipoProdotto!.toString());
  }
}
