import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxFileDropEntry, FileSystemFileEntry, NgxFileDropModule } from 'ngx-file-drop';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { UtilityService } from '../../../services/utility.service';


@Component({
  selector: 'app-sinc-bipiol',
  imports: [CommonModule, NgxFileDropModule],
  templateUrl: './sinc-bipiol.component.html',
  styleUrl: './sinc-bipiol.component.scss'
})
export class SincBipiolComponent {

    uploadProgress: number | null = null;
    uploadCompleted: boolean = false;
    erroreMessage: string | null = null;
    validMessage: string | null = null;
    preload: boolean = false;

   constructor(private http: HttpClient, private utilityService: UtilityService){}

   onFileDrop(files: NgxFileDropEntry[]) {
      for (const droppedFile of files) {
        if (droppedFile.fileEntry.isFile) {
          const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;

          this.uploadProgress = 0;
          this.uploadCompleted = false;

          fileEntry.file((file: File) => {
            // Controlla se è un file .txt
            if (!file.name.endsWith('.txt')) {
              this.erroreMessage = "Sono ammessi solo file TXT.";
              return;
            }

            const reader = new FileReader();

            reader.onload = () => {
              const textContent = reader.result as string;

              if (!textContent.trim()) {
                this.erroreMessage = "Il file è vuoto.";
                return;
              }

              const base64Content = btoa(textContent);

              this.uploadProgress = 100;
              this.uploadCompleted = true;
              this.preload = true;

              this.utilityService.SignBullettinPaidAndReturnCSV(base64Content)
                .subscribe((base64Csv: string) => {
                  
                  this.preload = false;

                  if (!base64Csv) {
                    this.erroreMessage = "Nessun dato disponibile";
                    return;
                  }

                  // Decodifica Base64 in Uint8Array
                  const csvBytes = Uint8Array.from(atob(base64Csv), c => c.charCodeAt(0));
                  const blobFinale = new Blob([csvBytes], { type: 'text/csv;charset=utf-8;' });
                  const url = window.URL.createObjectURL(blobFinale);

                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'sync-bipiol.csv';
                  a.click();

                  window.URL.revokeObjectURL(url);

                  this.validMessage = "File correttamente creato e scaricato";
                });            
            };

            reader.onerror = (error) => {
              this.erroreMessage = "Errore durante la lettura del file:", error;
            };

            reader.readAsText(file); 
          });
        }
      }
   }

}
