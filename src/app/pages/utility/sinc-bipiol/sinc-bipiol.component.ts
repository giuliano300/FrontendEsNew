import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxFileDropEntry, FileSystemFileEntry, NgxFileDropModule } from 'ngx-file-drop';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { UtilityService } from '../../../services/utility.service';
import { ShepherdService } from 'angular-shepherd';
import { Placement as PopperPlacement } from '@popperjs/core';
import { TourPage } from '../../../interfaces/EnumTypes';
import { TourSeen } from '../../../interfaces/TourSeen';
import { TourSeenService } from '../../../services/tourSeen.service';


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

   constructor(private http: HttpClient, private utilityService: UtilityService, private shepherdService: ShepherdService, private tourService: TourSeenService){}

   page: number = TourPage.sincBipiol;

    ngOnInit() {

      this.getTourInThisPage();

    }

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
            { text: 'Fine', action: () => this.shepherdService.complete() }
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
