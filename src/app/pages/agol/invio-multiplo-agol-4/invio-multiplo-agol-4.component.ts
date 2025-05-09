import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxFileDropEntry, FileSystemFileEntry, NgxFileDropModule } from 'ngx-file-drop';
import { HttpClient, HttpClientModule, HttpEvent, HttpEventType } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { bulletin } from '../../../../main';


@Component({
  selector: 'app-invio-multiplo-agol-4',
  imports: [CommonModule, ReactiveFormsModule, NgxFileDropModule, RouterLink],
  templateUrl: './invio-multiplo-agol-4.component.html',
  styleUrl: './invio-multiplo-agol-4.component.scss'
})
export class InvioMultiploAgol4Component {

  bulletin: string | null = "senza bollettino";

  form: FormGroup;
  uploadProgress: number | null = null;
  uploadCompleted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
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

  ngOnInit(): void {
  
    const bul = localStorage.getItem('bulletin')!;
    if(parseInt(bul) == bulletin.si)
      this.bulletin = "con bollettino";
    
  }

  onSubmit() {
    if (this.form.valid) {
      this.router.navigate(['/calcoloPreventivo']);
    }
  }



}
