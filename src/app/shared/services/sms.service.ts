import { Component, Inject, Injectable, OnDestroy, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Client, SMSDTO, Template } from '../models/api.model';
import { FormControl } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { MatSelect } from '@angular/material/select';
import { ApiService } from './api.service';
import { UserService } from './user.service';
import { takeUntil } from 'rxjs/operators';
import { CommunicationService } from '../../communication/communication.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SmsService {

  constructor(
    private dialog: MatDialog,
  ) { }

  sendSMS(client?: Client): void {
    const dialog = this.dialog.open(SMSDialogComponent, {
      width: '800px',
      data: { client },
    });
  }
}

@Component({
  selector: 'app-sms-dialog',
  template: `
    <h1>Send SMS
      <span *ngIf="!clients?.length && client">
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
            {{!client.prefix && !client.firstname && !client.lastname ? '-' : ''}}
            {{ displayPhoneNumbers(client) }}
          </mat-option>
        </mat-select>
      </mat-form-field>
    </div>

    <div class="flex-row">
      <mat-form-field appearance="outline">
        <mat-label>To</mat-label>
        <mat-select [(ngModel)]="to">
          <mat-option *ngIf="client?.phone" [value]="client.phone">{{ client.phone }}</mat-option>
          <mat-option *ngIf="client?.otherPhone" [value]="client.otherPhone">{{ client.otherPhone }}</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>SMS Templates</mat-label>
          <mat-select>
            <mat-option [value]="null" (click)="setTemplate(deadTemplate)"><i>clear</i></mat-option>
            <mat-option *ngFor="let template of templates" [value]="template" (click)="setTemplate(template)">
              {{ template.title }}
            </mat-option>
          </mat-select>
      </mat-form-field>
    </div>

    <mat-form-field appearance="outline" class="full">
        <mat-label>Body</mat-label>
        <textarea rows="5" matInput [(ngModel)]="body"></textarea>
    </mat-form-field>

    <hr/>

    <div class="right">
      <button mat-raised-button color="warn" (click)="dialogRef.close()">Cancel</button>&nbsp;
      <button mat-raised-button color="primary" (click)="send()" [disabled]="!to">Send</button>
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
export class SMSDialogComponent implements OnDestroy {
  to: string;
  client: Client;
  body: string;
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
    public dialogRef: MatDialogRef<SMSDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SMSData,
    private apiService: ApiService,
    private userService: UserService,
    private communicationService: CommunicationService,
    private snackBar: MatSnackBar,
  ) {
    this.client = data?.client;
    if (!this.client) {
      this.apiService.getClientsWithSMS(clients => {
        this.clients = clients;
        this.filteredClients.next(this.clients.slice());
        this.clientFilterCtrl.valueChanges.pipe(takeUntil(this.onDestroy))
          .subscribe(() => {
            this.filterClients();
          });
      });
      this.clientCtrl.valueChanges.pipe(takeUntil(this.onDestroy)).subscribe(value => {
        this.to = null;
        this.client = value;
      });
    }
    this.apiService.getTemplates(templates => this.templates = templates.filter(template => template.type === 'SMS'));
  }

  setTemplate(template: Template) {
    this.body = template.body;
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
        (client.phone || '').toLowerCase().indexOf(search) > -1 ||
        (client.otherPhone || '').toLowerCase().indexOf(search) > -1
      )
    );
  }

  send(): void {
    if (!this.to) { return; }

    const body: SMSDTO = {
      username: this.userService.username,
      clientId: this.client.id,
      to: this.to,
      body: this.body,
      date: new Date().toISOString(),
    };

    this.apiService.sendSMS(body, res => {
      if (res) {
        this.communicationService.refreshCommunication.next();
        this.snackBar.open(res, 'ok');
        this.dialogRef.close(true);
      }
    });
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  displayPhoneNumbers(client: Client): string {
    return `${client.phone ? `(${client.phone})` : ''} ${client.otherPhone ? `(${client.otherPhone})` : ''}`;
  }
}

export interface SMSData {
  client?: Client;
}
