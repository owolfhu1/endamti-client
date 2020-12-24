import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface PopupData {
  title: string;
  message: string;
  info?: boolean;
  continue: string;
  cancel?: string;
}

@Component({
  selector: 'app-basic-popup',
  templateUrl: './basic-popup.component.html',
  styleUrls: ['./basic-popup.component.css']
})
export class BasicPopupComponent {
  title: string;
  message: string;
  isInfo: boolean;
  continue: string;
  cancel: string;

  constructor(
    private dialogRef: MatDialogRef<BasicPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PopupData,
    ) {
    this.title = data.title;
    this.message = data.message;
    this.isInfo = !!data.info;
    this.continue = data.continue;
    this.cancel = data.cancel;
  }

  close(cont: boolean) {
    this.dialogRef.close(cont);
  }

}
