import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxFileDropEntry, FileSystemFileEntry, NgxFileDropModule } from 'ngx-file-drop';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-rendicontazione-fatture',
  imports: [CommonModule, NgxFileDropModule],
  templateUrl: './rendicontazione-fatture.component.html',
  styleUrl: './rendicontazione-fatture.component.scss'
})
export class RendicontazioneFattureComponent {

    uploadProgress: number | null = null;
    uploadCompleted: boolean = false;

   constructor(private http: HttpClient){}

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


}
