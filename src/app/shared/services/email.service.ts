import { Component, Inject, Injectable, OnDestroy, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ApiService } from './api.service';
import { FormControl } from '@angular/forms';
import {Client, EmailDTO, Template} from '../models/api.model';
import { ReplaySubject, Subject } from 'rxjs';
import { MatSelect } from '@angular/material/select';
import { takeUntil } from 'rxjs/operators';
import { UserService } from './user.service';
import { CommunicationService } from '../../communication/communication.service';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(
    private dialog: MatDialog,
  ) { }

  sendEmail(client?: Client): void {
    const dialog = this.dialog.open(EmailDialogComponent, {
      width: '800px',
      data: { client },
    });
  }
}

@Component({
  selector: 'app-email-dialog',
  template: `
    <h1>
      Send Email
      <span *ngIf="!clients?.length">
        &nbsp;to #{{client.id}} {{client.prefix}}{{client.prefix ? '.' : ''}} {{client.firstname}} {{client.lastname}}
      </span>
    </h1>
    <hr/>
    <div *ngIf="clients?.length">
      <mat-form-field appearance="outline" class="full">
        <mat-label>Client Select</mat-label>
        <mat-select [formControl]="clientCtrl">
          <mat-option>
            <ngx-mat-select-search [formControl]="clientFilterCtrl" placeholderLabel="filter"></ngx-mat-select-search>
          </mat-option>

          <mat-option *ngFor="let client of filteredClients | async" [value]="client">
            #{{client.id}} {{client.prefix}}{{client.prefix ? '.' : ''}} {{client.firstname}} {{client.lastname}}
            {{!client.prefix && !client.firstname && !client.lastname ? '-' : ''}} ({{client.email}})
          </mat-option>
        </mat-select>
      </mat-form-field>
    </div>

    <p>
      To: {{ client?.email || '' }}
    </p>

    <div class="flex-row">
      <mat-form-field appearance="outline">
        <mat-label>Subject</mat-label>
        <input matInput [(ngModel)]="subject">
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Email Templates</mat-label>
        <mat-select>
          <mat-option [value]="null" (click)="setTemplate(deadTemplate)"><i>clear</i></mat-option>
          <mat-option *ngFor="let template of templates" [value]="template" (click)="setTemplate(template)">
            {{ template.title }}
          </mat-option>
        </mat-select>
      </mat-form-field>
    </div>

    <ckeditor [editor]="editor" [(ngModel)]="editorValue"></ckeditor>
    <hr/>

    <div class="right">
      <button mat-raised-button color="warn" (click)="dialogRef.close()">Cancel</button>&nbsp;
      <button mat-raised-button color="primary" (click)="send()" [disabled]="!client">Send</button>
    </div>
  `,
  styles: [`
    .right {
      text-align: right;
    }
    .flex-row {
      display: flex;
      justify-content: space-between;
    }
  `],
})
export class EmailDialogComponent implements OnDestroy {
  subject;
  editor = ClassicEditor;
  editorValue = '';
  client: Client;
  clientCtrl = new FormControl();
  clientFilterCtrl = new FormControl();
  filteredClients: ReplaySubject<Client[]> = new ReplaySubject<Client[]>(1);
  clients;
  onDestroy = new Subject<void>();
  deadTemplate: Template = {
    type: 'EMAIL',
    body: '',
    title: undefined,
  };
  templates: Template[] = [];

  @ViewChild('clientSelect', { static: true }) clientSelect: MatSelect;

  constructor(
    public dialogRef: MatDialogRef<EmailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EmailData,
    private apiService: ApiService,
    private userService: UserService,
    private communicationService: CommunicationService,
  ) {
    this.client = data?.client;
    if (!this.client) {
      this.apiService.getClientsWithEmail(clients => {
        this.clients = clients;
        this.filteredClients.next(this.clients.slice());
        this.clientFilterCtrl.valueChanges.pipe(takeUntil(this.onDestroy))
          .subscribe(() => {
            this.filterClients();
          });
      });
      this.clientCtrl.valueChanges.pipe(takeUntil(this.onDestroy)).subscribe(value => {
        this.client = value;
      });
    }
    this.apiService.getTemplates(templates => this.templates = templates.filter(template => template.type === 'EMAIL'));
  }

  setTemplate(template: Template) {
    this.editorValue = template.body;
    this.subject = template.subject;
  }

  filterClients() {
    if (!this.clients) {
      return;
    }

    let search = this.clientFilterCtrl.value;
    if (!search) {
      this.filteredClients.next(this.clients.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    this.filteredClients.next(
      this.clients.filter(client =>
        (client.firstname || '').toLowerCase().indexOf(search) > -1 ||
        (client.lastname || '').toLowerCase().indexOf(search) > -1 ||
        client.email.toLowerCase().indexOf(search) > -1
      )
    );
  }

  send() {
    if (!this.client) { return; }

    const body: EmailDTO = {
      username: this.userService.username,
      clientId: this.client.id,
      to: this.client.email,
      body: this.editorValue,
      subject: this.subject,
      date: new Date().toISOString(),
    };

    this.apiService.sendEmail(body, res => {
      if (res) {
        this.communicationService.refreshCommunication.next();
        this.dialogRef.close(true);
      }
    });
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
  }
}

export interface EmailData {
  client?: Client;
}
