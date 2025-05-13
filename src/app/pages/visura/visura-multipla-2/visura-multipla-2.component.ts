import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxFileDropEntry, FileSystemFileEntry, NgxFileDropModule } from 'ngx-file-drop';
import { HttpClient, HttpClientModule, HttpEvent, HttpEventType } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-visura-multipla-2',
  imports: [CommonModule, ReactiveFormsModule, NgxFileDropModule, RouterLink],
  templateUrl: './visura-multipla-2.component.html',
  styleUrl: './visura-multipla-2.component.scss'
})
export class VisuraMultipla2Component {
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

  onSubmit() {
    if (this.form.valid) {
      this.router.navigate(['/calcoloPreventivo']);
    }
  }

}
