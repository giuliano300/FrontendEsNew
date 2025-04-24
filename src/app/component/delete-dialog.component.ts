import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { UserSendersService } from '../services/user-senders.service';

@Component({
  selector: 'app-delete-dialog',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './delete-dialog.component.html',
  styleUrl: './delete-dialog.component.scss'
})
export class DeleteDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, 
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    private userSenderService: UserSendersService) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onDelete(): void {
    console.log('Elemento eliminato:', this.data);
    switch(this.data.type){
      case "userSender":
        this.userSenderService.deleteUserSender(this.data.id).subscribe({
          next: (response) => {
            console.log('Utente eliminato con successo:', response);
            this.dialogRef.close(true);
          },
          error: (error) => {
            console.error('Errore nell\'eliminazione dell\'utente:', error);
          }
        });
        break;
    }
  }
}
