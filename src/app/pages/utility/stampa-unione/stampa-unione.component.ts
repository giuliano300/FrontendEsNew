import { AppTourService } from '@app/services/app-tour.service';
import { AppStorageService } from '@app/services/app-storage.service';
import { UiTourRestartComponent } from '@app/shared/ui';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxFileDropEntry, FileSystemFileEntry, NgxFileDropModule } from 'ngx-file-drop';
import { UtilityService } from '../../../services/utility.service';
import { Router } from '@angular/router';
import { Users } from '../../../interfaces/Users';
import { ShepherdService } from 'angular-shepherd';
import { Placement as PopperPlacement } from '@popperjs/core';
import { TourPage } from '../../../interfaces/EnumTypes';
import { TourSeen } from '../../../interfaces/TourSeen';

@Component({
  selector: 'app-stampa-unione',
  imports: [UiTourRestartComponent, CommonModule, NgxFileDropModule],
  templateUrl: './stampa-unione.component.html',
  styleUrl: './stampa-unione.component.scss'
})
export class StampaUnioneComponent {
    
  
  private appTour = inject(AppTourService);
private appStorage = inject(AppStorageService);
uploadProgress: number | null = null;
    uploadCompleted: boolean = false;
    erroreMessage: string | null = null;
    validMessage: string | null = null;
    preload: boolean = false;
    user: Users | null = null;

   constructor(private router: Router, private utilityService: UtilityService, private shepherdService: ShepherdService){}

    page: number = TourPage.stampaUnione;


  ngOnInit() {
    const user = this.appStorage.getItem('user');
    if (!user) {
      this.router.navigate(['/']);
      return;
    }

    this.user! = JSON.parse(user!);
    
    this.getTourInThisPage();

  }

   onFileDrop(files: NgxFileDropEntry[]) {
      this.resetUploadState();

      const droppedFile = files.find(file => file.fileEntry.isFile);
      if (!droppedFile) {
        this.erroreMessage = "Nessun file valido selezionato.";
        return;
      }

      const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;

      fileEntry.file((file: File) => {
        if (!file.name.toLowerCase().endsWith('.zip')) {
          this.erroreMessage = "Sono ammessi solo file ZIP.";
          this.uploadProgress = null;
          return;
        }

        this.processZip(file);
      });
   }

  private async processZip(file: File) {
    this.uploadProgress = 100;
    this.uploadCompleted = true;
    this.preload = true;

    try {
      await this.utilityService.downloadStampaEunione(file, this.user!.id);
      this.validMessage = "File correttamente creato. Download avviato.";
    } catch (error) {
      this.erroreMessage = error instanceof Error
        ? error.message
        : "Errore nella richiesta al server.";
      this.uploadProgress = null;
      this.uploadCompleted = false;
    } finally {
      this.preload = false;
    }
  }

  private resetUploadState() {
    this.uploadProgress = 0;
    this.uploadCompleted = false;
    this.erroreMessage = null;
    this.validMessage = null;
    this.preload = false;
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
        },
      ];
    this.appTour.start(this.page, steps);

  }

  
  //COPIARE SENZA TOCCARE
  restartTour(){
    this.startTour();
  }

  getTourInThisPage(){
    let userTourPage: TourSeen[] = JSON.parse(this.appStorage.getItem("userTourPage")?.toString() || "[]");
    if(!userTourPage.some(tour => tour.page === this.page))
      this.startTour();
  }

  ///////////////////////////

}
