import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxFileDropEntry, FileSystemFileEntry, NgxFileDropModule } from 'ngx-file-drop';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { UtilityService } from '../../../services/utility.service';
import { ZipResponse } from '../../../interfaces/ZipResponse';
import { ShepherdService } from 'angular-shepherd';
import { Placement as PopperPlacement } from '@popperjs/core';
import { TourPage } from '../../../interfaces/EnumTypes';
import { TourSeen } from '../../../interfaces/TourSeen';
import { TourSeenService } from '../../../services/tourSeen.service';

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

   constructor(private http: HttpClient, private utilityService: UtilityService, private shepherdService: ShepherdService, private tourService: TourSeenService){}

   page: number = TourPage.comprimiPDf;

    ngOnInit() {

      this.getTourInThisPage();

    }



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


    startTour() {
      const steps = [
        {
          id: 'archiviovisure1',
          text: "Carica il file e segui le istruzioni.",
          attachTo: {
            element: '.step-1',
            on: 'bottom' as PopperPlacement
          },
          modalOverlayOpeningPadding: 14,
          modalOverlayOpeningRadius: 5,
          classes: 'margin-step-y', 
          buttons: [
            { text: 'Avanti', action: () => this.shepherdService.complete() }
          ]
        }
      ];

    // Abilita il dark overlay
    this.shepherdService.modal = true;

    // Opzioni di default per tutti gli step
    this.shepherdService.defaultStepOptions = {
      scrollTo: true,
      cancelIcon: { enabled: true },
      classes: 'shepherd-theme-arrows'
    };

    // Carica e avvia il tour
    this.shepherdService.addSteps(steps);

    // Ritarda il primo step
    setTimeout(() => {
      this.shepherdService.start();
      this.completeTour();
    }, 300);

  }

  
  //COPIARE SENZA TOCCARE
  restartTour(){
    this.startTour();
  }
  
  completeTour()
  {
    this.shepherdService.tourObject?.on('complete', () => {
      this.tourService.setTourSeen(this.page).subscribe();
    });
  }

  getTourInThisPage(){
    let userTourPage: TourSeen[] = JSON.parse(localStorage.getItem("userTourPage")?.toString() || "[]");
    if(!userTourPage.some(tour => tour.page === this.page))
      this.startTour();
  }

  ///////////////////////////

}
