import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectionSingleMultipleComponent } from '../../../component/selection-single-multiple/selection-single-multiple.component';
import { productType } from '../../../../main';


@Component({
  selector: 'app-tipo-spedizione',
  imports: [ReactiveFormsModule, CommonModule, SelectionSingleMultipleComponent],
  templateUrl: './tipo-spedizione.component.html',
  styleUrl: './tipo-spedizione.component.scss'
})
export class TipoSpedizioneRaccomandataComponent {
  constructor() {}

  tipoProdotto: number = productType.raccomandata; 

  ngOnInit(): void{
    localStorage.setItem('productType', this.tipoProdotto!.toString());
  }
}
