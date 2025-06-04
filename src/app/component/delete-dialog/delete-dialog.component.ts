import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { UserSendersService } from '../../services/user-senders.service';
import { UsersService } from '../../services/users.service';
import { UserRecipientsService } from '../../services/user-recipients.service';

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
    private userSenderService: UserSendersService, 
    private usersService: UsersService,
    private userRecipientService : UserRecipientsService
  ) {}

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
      case "users":
        this.usersService.deleteUser(this.data.id).subscribe({
          next: (response) => {
            console.log('Utente eliminato con successo:', response);
            this.dialogRef.close(true);
          },
          error: (error) => {
            console.error('Errore nell\'eliminazione dell\'utente:', error);
          }
        });
        break;
      case "userRecipient":
        this.userRecipientService.deleteUserRecipient(this.data.id).subscribe({
          next: (response) => {
            console.log('Destinatario eliminato con successo:', response);
            this.dialogRef.close(true);
          },
          error: (error) => {
            console.error('Errore nell\'eliminazione del destinatario:', error);
          }
        });
        break;
    }
  }
}
