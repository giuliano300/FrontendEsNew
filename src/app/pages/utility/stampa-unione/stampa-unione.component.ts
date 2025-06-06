import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxFileDropEntry, FileSystemFileEntry, NgxFileDropModule } from 'ngx-file-drop';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { UtilityService } from '../../../services/utility.service';
import { Router } from '@angular/router';
import { Users } from '../../../interfaces/Users';
import { ZipResponse } from '../../../interfaces/ZipResponse';

@Component({
  selector: 'app-stampa-unione',
  imports: [CommonModule, NgxFileDropModule],
  templateUrl: './stampa-unione.component.html',
  styleUrl: './stampa-unione.component.scss'
})
export class StampaUnioneComponent {
    uploadProgress: number | null = null;
    uploadCompleted: boolean = false;
    erroreMessage: string | null = null;
    validMessage: string | null = null;
    preload: boolean = false;
    user: Users | null = null;

   constructor(private router: Router, private http: HttpClient, private utilityService: UtilityService){}

  ngOnInit() {
    const user = localStorage.getItem('user');
    if (!user) {
      this.router.navigate(['/']);
      return;
    }

    this.user! = JSON.parse(user!);

  }

   onFileDrop(files: NgxFileDropEntry[]) {
      for (const droppedFile of files) {
        if (droppedFile.fileEntry.isFile) {
          const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;

          this.uploadProgress = 0;
          this.uploadCompleted = false;

          fileEntry.file((file: File) => {
            // Controlla se è un file .zip
            if (!file.name.endsWith('.zip')) {
              this.erroreMessage = "Sono ammessi solo file zip.";
              return;
            }

            const reader = new FileReader();

            reader.onload = () => {
            // reader.result è di tipo ArrayBuffer
              const arrayBuffer = reader.result as ArrayBuffer;
              
              // converto ArrayBuffer in Uint8Array
              const uint8Array = new Uint8Array(arrayBuffer);
              
              // converto Uint8Array in base64
              let binary = '';
              for (let i = 0; i < uint8Array.byteLength; i++) {
                binary += String.fromCharCode(uint8Array[i]);
              }
              const base64Content = btoa(binary);

              const zipContent = {
                uid: this.user!.id,
                base64Zip: base64Content
              }

              this.uploadProgress = 100;
              this.uploadCompleted = true;
              this.preload = true;

              this.utilityService.GetStampaEunione(zipContent)
                .subscribe((zipStampaUnione: ZipResponse) => {
                  
                  this.preload = false;

                  if (!zipStampaUnione) {
                    this.erroreMessage = "Nessun dato disponibile";
                    return;
                  }

                  if (!zipStampaUnione.success) {
                    this.erroreMessage = zipStampaUnione.errorMessage!;
                    return;
                  }

                  // Decodifica Base64 in Uint8Array
                  const zipBytes = Uint8Array.from(atob(zipStampaUnione.base64Zip!), c => c.charCodeAt(0));
                  const blobFinale = new Blob([zipBytes], { type: 'application/zip' }); 
                  const url = window.URL.createObjectURL(blobFinale);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'stampa-unione.zip';
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
