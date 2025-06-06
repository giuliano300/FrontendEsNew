import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxFileDropEntry, FileSystemFileEntry, NgxFileDropModule } from 'ngx-file-drop';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UtilityService } from '../../../services/utility.service';
import { PdfUnioneResponse } from '../../../interfaces/PdfUnioneResponse';

@Component({
  selector: 'app-unione-pdf',
  imports: [CommonModule, NgxFileDropModule, ReactiveFormsModule],
  templateUrl: './unione-pdf.component.html',
  styleUrl: './unione-pdf.component.scss'
})
export class UnionePdfComponent {
@ViewChild('uplPdf') uplPdfRef!: ElementRef<HTMLInputElement>;

uploadProgress: number | null = null;
uploadCompleted: boolean = false;
erroreMessage: string | null = null;
validMessage: string | null = null;
preload: boolean = false;


form!: FormGroup;
zipFile!: File;
  
constructor(private http: HttpClient, private fb: FormBuilder, private utilityService: UtilityService) {
  this.form = this.fb.group({
    sel_unione: ['']
  });
}

onFileDrop(files: NgxFileDropEntry[]) {
  this.uploadProgress = 0;
  this.uploadCompleted = false;

  for (const droppedFile of files) {
    if (droppedFile.fileEntry.isFile) {
      const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;

      this.uploadProgress = 100;
      this.uploadCompleted = true;

      fileEntry.file((file: File) => {
        if (!file.name.endsWith('.zip')) {
          this.erroreMessage = "È necessario caricare un file .zip";
          return;
        }
        this.zipFile = file;
      });
    }
  }
}

async onSubmit(formValue: any) {
  const insertionValue = formValue.sel_unione;

  if (!this.zipFile || !this.uplPdfRef.nativeElement.files?.[0]) {
    this.erroreMessage = "Devi caricare sia il file ZIP che il file PDF.";
    return;
  }

  this.erroreMessage = "";
  this.preload = true;

  const pdfFile = this.uplPdfRef.nativeElement.files[0];
  const base64Zip = await this.readAsBase64(this.zipFile);
  const base64Pdf = await this.readAsBase64(pdfFile);

  const payload = {
    pageToAddBase64: base64Pdf,
    basePdfZipBase64: base64Zip,
    insertionPosition: insertionValue === '1' ? 1 : 2
  };

  this.utilityService.GetUnisciPdf(payload).subscribe({
    next: (response: PdfUnioneResponse) => {

      this.preload = false;

      if (response.success && response.zipBase64) {
        const zipBlob = this.base64ToBlob(response.zipBase64, 'application/zip');
        const url = URL.createObjectURL(zipBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'output.zip';
        a.click();
        URL.revokeObjectURL(url);
      } 
      else 
      {
        console.error('Errore nella risposta:', response.errorMessage);
        this.erroreMessage = "Errore: " + (response.errorMessage ?? "Errore sconosciuto");
      }
      },
      error: (err) => {
        console.error('Errore HTTP:', err);
        this.erroreMessage = "Errore nella richiesta al server";
        this.uploadProgress = null;
        this.uploadCompleted = false;
      }
    });  
  }

  readAsBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  base64ToBlob(base64: string, contentType: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = Array.from(byteCharacters, c => c.charCodeAt(0));
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
  }

}
