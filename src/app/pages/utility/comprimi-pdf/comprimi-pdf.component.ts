import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxFileDropEntry, FileSystemFileEntry, NgxFileDropModule } from 'ngx-file-drop';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { UtilityService } from '../../../services/utility.service';
import { ZipResponse } from '../../../interfaces/ZipResponse';

@Component({
  selector: 'app-comprimi-pdf',
  imports: [CommonModule, NgxFileDropModule],
  templateUrl: './comprimi-pdf.component.html',
  styleUrl: './comprimi-pdf.component.scss'
})
export class ComprimiPdfComponent {
  uploadProgress: number | null = null;
  uploadCompleted: boolean = false;
  erroreMessage: string | null = null;
  validMessage: string | null = null;
  preload: boolean = false;

   constructor(private http: HttpClient, private utilityService: UtilityService){}

   onFileDrop(files: NgxFileDropEntry[]) {
      this.uploadProgress = 0;
      this.uploadCompleted = false;

      for (const droppedFile of files) {
        if (droppedFile.fileEntry.isFile) {
          const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;

          fileEntry.file((file: File) => {
            // Controlla se è un file .txt
            if (!file.name.endsWith('.zip')) {
              this.erroreMessage = "Sono ammessi solo file ZIP.";
              return;
            }
            
            this.uploadProgress = 100;
            this.uploadCompleted = true;

            const reader = new FileReader();

            reader.onload = () => {
              const arrayBuffer = reader.result as ArrayBuffer;
              const uint8Array = new Uint8Array(arrayBuffer);

              let binary = '';
              for (let i = 0; i < uint8Array.byteLength; i++) {
                binary += String.fromCharCode(uint8Array[i]);
              }

              const base64Content = btoa(binary);
              console.log(base64Content);

              this.preload = true;

              const zipRequest = {
                base64Zip: base64Content,
                uid:0
              };

              this.utilityService.GetComprimiPdf(zipRequest)
                .subscribe((zipResponse: ZipResponse) => {
                  
                  this.preload = false;

                  if (!zipResponse) {
                    this.erroreMessage = "Nessun dato disponibile";
                    return;
                  }

                  if (!zipResponse.success) {
                    this.erroreMessage = "Errore nella compressione dei file.";
                    return;
                  }

                  // Decodifica Base64 in Uint8Array
                  const zipBytes = Uint8Array.from(atob(zipResponse.base64Zip!), c => c.charCodeAt(0));
                  const blobFinale = new Blob([zipBytes], { type: 'application/zip' }); 
                  const url = window.URL.createObjectURL(blobFinale);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'compressed-file.zip';
                  a.click();

                  window.URL.revokeObjectURL(url);

                  this.validMessage = "File correttamente creato e scaricato";
                });            
            };

            reader.onerror = (error) => {
              this.erroreMessage = "Errore durante la lettura del file:", error;
            };

            reader.readAsArrayBuffer(file); 
          });
        }
      }
   }
}
