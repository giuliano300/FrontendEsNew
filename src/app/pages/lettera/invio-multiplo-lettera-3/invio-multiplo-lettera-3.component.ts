import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators,FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxFileDropEntry, FileSystemFileEntry, NgxFileDropModule } from 'ngx-file-drop';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { alertName,alertComplName,alertAddress,alertComplAddress,alertProvince, alertState } from '../../../enviroments/enviroments';


@Component({
  selector: 'app-invio-multiplo-lettera-3',
  imports: [CommonModule, ReactiveFormsModule, NgxFileDropModule, RouterLink, NgbModule],
  templateUrl: './invio-multiplo-lettera-3.component.html',
  styleUrl: './invio-multiplo-lettera-3.component.scss'
})
export class InvioMultiploLettera3Component {
  form: FormGroup;
  uploadProgress: number | null = null;
  uploadCompleted: boolean = false;

  currentModalRef: any;


  alertName = alertName;
  alertComplName = alertComplName;
  alertAddress = alertAddress;
  alertComplAddress = alertComplAddress;
  alertProvince = alertProvince;
  alertState = alertState;


  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private modalService: NgbModal
  ) {
    this.form = this.fb.group({
      // eventuali altri controlli
    });
  }

  onFileDrop(files: NgxFileDropEntry[]) {
    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;

        fileEntry.file((file: File) => {
          const formData = new FormData();
          formData.append('file', file, droppedFile.relativePath);

          this.uploadProgress = 0;
          this.uploadCompleted = false;

          this.http.post('/api/upload', formData, {
            reportProgress: true,
            observe: 'events'
          }).subscribe((event: HttpEvent<any>) => {
            if (event.type === HttpEventType.UploadProgress && event.total) {
              this.uploadProgress = Math.round((event.loaded / event.total) * 100);
            } else if (event.type === HttpEventType.Response) {
              console.log('Upload completato', event.body);
              this.uploadProgress = 100;
              this.uploadCompleted = true;
            }
          });
        });
      }
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.router.navigate(['/invioMultiploLettera4']);
    }
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      rag_soc: new FormControl(''),
      nome: new FormControl(''),
      cognome: new FormControl(''),
      compl_nom: new FormControl(''),
      cod_fisc: new FormControl(''),
      comp_indirizzo: new FormControl(''),
      cap: new FormControl(''),
      citta: new FormControl(''),
      provincia: new FormControl(''),
      stato: new FormControl(''),
      file: new FormControl('')
    });
  }


    // Metodo per aprire il modal e salvare il riferimento
    openModal(content: any) {
      const modalRef = this.modalService.open(content, { centered: true, backdrop: 'static', keyboard: true });
      this.currentModalRef = modalRef;

      // Gestione della chiusura "manuale" o tramite esc/click esterno
      modalRef.result.catch(() => {}); // evita errori non gestiti
    }

  // Metodo per navigare e chiudere il modal
    navigateAndClose(route: string) {
      if (this.currentModalRef) {
        this.currentModalRef.close();
      }
      this.router.navigate([route]);
    }


}
