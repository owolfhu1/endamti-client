import { AfterViewInit, Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Client, Communication, Template } from '../shared/models/api.model';
import { MatPaginator } from '@angular/material/paginator';
import { ApiService } from '../shared/services/api.service';
import { UserService } from '../shared/services/user.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommunicationService } from './communication.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { BasicPopupComponent } from '../shared/components/basic-popup/basic-popup.component';


const formatAMPM = date => {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  const strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
};

@Component({
  selector: 'app-communication',
  templateUrl: './communication.component.html',
  styleUrls: ['./communication.component.css']
})
export class CommunicationComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['type', 'sentBy', 'destination', 'subject', 'date', 'view'];
  dataSource = new MatTableDataSource<Communication>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  sentBy: string;
  destination: string;
  type = 'ANY';
  onDestroy = new Subject<void>();

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    private apiService: ApiService,
    private userService: UserService,
    private dialog: MatDialog,
    private communicationService: CommunicationService,
  ) { }

  ngOnInit(): void {
    this.sentBy = this.userService.username;
    this.communicationService.refreshCommunication.pipe(takeUntil(this.onDestroy)).subscribe(() => this.search());
  }

  search(): void {
    this.apiService.communicationSearch({
      type: this.type,
      sentBy: this.sentBy ? this.sentBy : undefined,
      destination: this.destination ? this.destination : undefined,
    }, results => this.dataSource.data = results);
  }

  reset(): void {
    this.type = 'ANY';
    this.destination = null;
    this.sentBy = this.userService.username;
    this.search();
  }

  view(data: Communication): void {
    const dialog = this.dialog.open(ViewCommunicationDialogComponent, { width: '800px', data });
  }

  templates() {
    const dialog = this.dialog.open(TemplateDialogComponent, { width: '800px' });
  }

  displayDateAndTime(dateString: string) {
    const date = new Date(dateString);
    return date.toDateString() + ' ' + formatAMPM(date);
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }
}

@Component({
  selector: 'app-view-communication',
  template: `
    <div class="header">
      <h1>
        View {{ communication.type === 'EMAIL' ? 'Email' : 'SMS' }}
        <span *ngIf="client">
            &nbsp;to #{{client.id}} {{client.prefix}}{{client.prefix ? '.' : ''}} {{client.firstname}} {{client.lastname}}
        </span>
      </h1>
      <button (click)="dialogRef.close()" mat-icon-button color="warn"><mat-icon>cancel</mat-icon></button>
    </div>
    <hr>
    <p><b>Date:</b> {{ displayDateAndTime(communication.date) }}</p>
    <p><b>From:</b> {{ communication.username }}</p>
    <p><b>To:</b> {{ communication.destination }}</p>
    <p *ngIf="communication.type === 'EMAIL'"><b>Subject:</b> {{ communication.subject }}</p>
    <hr>
    <div id="communication-body"></div>
  `,
  styles: [`
    .header {
      display: flex;
      justify-content: space-between;
    }
  `]
})
export class ViewCommunicationDialogComponent implements OnInit {
  client: Client;
  communication: Communication;

  constructor(
    public dialogRef: MatDialogRef<ViewCommunicationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Communication,
    private apiService: ApiService,
  ) {
    this.communication = data;
    this.apiService.getClient(data.clientId, client => this.client = client)
  }

  ngOnInit(): void {
    document.getElementById('communication-body').innerHTML = this.communication.body;
  }

  displayDateAndTime(dateString: string) {
    const date = new Date(dateString);
    return date.toDateString() + ' ' + formatAMPM(date);
  }
}

@Component({
  selector: 'app-templates',
  template: `
    <div class="header">
      <h1>Templates</h1>

      <div>
        <mat-button-toggle-group [(ngModel)]="mode" appearance="legacy" (change)="reset()">
          <mat-button-toggle value="ADD">Add</mat-button-toggle>
          <mat-button-toggle value="EDIT">Edit</mat-button-toggle>
        </mat-button-toggle-group>
        &nbsp;
        <mat-button-toggle-group [(ngModel)]="type" appearance="legacy" (change)="typeChange($event)">
          <mat-button-toggle value="EMAIL">Email</mat-button-toggle>
          <mat-button-toggle value="SMS">SMS</mat-button-toggle>
        </mat-button-toggle-group>
      </div>
    </div>
    <hr>

    <div>
      <mat-form-field appearance="outline" *ngIf="mode === 'ADD'">
        <mat-label>Title</mat-label>
        <input type="text" matInput [(ngModel)]="title">
      </mat-form-field>
        
      <mat-form-field appearance="outline" *ngIf="mode === 'EDIT'">
        <mat-label>Title</mat-label>
        <mat-select [(ngModel)]="title">
          <mat-option *ngFor="let template of dynamicTemplates" [value]="template.title" (click)="setTemplate(template)">
            {{ template.title }}
          </mat-option>
        </mat-select>
      </mat-form-field>
    </div>

    <div *ngIf="type === 'EMAIL'">
      <mat-form-field appearance="outline">
        <mat-label>Subject</mat-label>
        <input type="text" matInput [(ngModel)]="subject">
      </mat-form-field>
    </div>

    <div>
      <ckeditor *ngIf="type === 'EMAIL'" [editor]="editor" [(ngModel)]="body"></ckeditor>

      <mat-form-field *ngIf="type === 'SMS'" appearance="outline" class="full">
        <mat-label>Body</mat-label>
        <textarea rows="5" matInput [(ngModel)]="body"></textarea>
      </mat-form-field>
    </div>

    <hr>
    <div class="right">
        <button mat-raised-button color="warn" (click)="dialogRef.close()">Cancel</button>&nbsp;
        <button *ngIf="mode === 'EDIT'" mat-raised-button color="primary" (click)="update()" [disabled]="!title">Update</button>&nbsp;
        <button *ngIf="mode === 'ADD'" mat-raised-button color="primary" (click)="add()" [disabled]="!title">Add</button>
        <button *ngIf="mode === 'EDIT'" mat-raised-button color="warn" (click)="delete()" [disabled]="!selectedTemplate">Delete</button>
    </div>
  `,
  styles: [`
    .right {
      text-align: right;
    }
    .header {
      display: flex;
      justify-content: space-between;
    }
  `]
})
export class TemplateDialogComponent implements OnInit {
  selectedTemplate;

  editor = ClassicEditor;
  mode = 'ADD';
  type = 'EMAIL';

  body = '';
  title: string;
  subject: string;

  emailTemplates: Template[];
  smsTemplates: Template[];
  dynamicTemplates: Template[] = [];
  allTemplates: Template[] = [];

  constructor(
    public dialogRef: MatDialogRef<ViewCommunicationDialogComponent>,
    private apiService: ApiService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.getTemplates();
  }

  getTemplates() {
    this.emailTemplates = [];
    this.smsTemplates = [];
    this.dynamicTemplates = [];
    this.apiService.getTemplates(templates => {
      this.allTemplates = templates;
      templates.forEach(template => {
        if (template.type === 'EMAIL') {
          this.emailTemplates.push(template);
        } else if (template.type === 'SMS') {
          this.smsTemplates.push(template);
        }
      });
      this.setDynamicTemplates();
    });
  }

  setTemplate(template: Template) {
    this.selectedTemplate = template;
    this.body = template.body;
    if (template.type === 'EMAIL') {
      this.subject = template.subject;
    }
  }

  setDynamicTemplates() {
    if (this.type === 'EMAIL') {
      this.dynamicTemplates = JSON.parse(JSON.stringify(this.emailTemplates));
    } else if (this.type === 'SMS') {
      this.dynamicTemplates = JSON.parse(JSON.stringify(this.smsTemplates));
    }
  }

  delete() {
    this.apiService.deleteTemplate(this.selectedTemplate.id, res => {
      this.reset();
      this.getTemplates();
    });
  }

  reset() {
    this.title = null;
    this.subject = null;
    this.body = '';
    this.selectedTemplate = null;
  }

  typeChange(event) {
    this.reset();
    this.setDynamicTemplates();
  }

  add() {
    if (this.allTemplates.findIndex(template => template.title === this.title) > -1) {
      const dialog = this.dialog.open(BasicPopupComponent, {
        width: '500px',
        data: {
          info: true,
          message: `The template title "${this.title}" already exists, please pick another title to continue.`,
          title: 'Title Already Exists',
          continue: 'OK',
        }
      });
    } else {
      this.apiService.addTemplate({
        title: this.title,
        type: this.type,
        subject: this.subject,
        body: this.body,
      }, res => this.dialogRef.close(res));
    }
  }

  update() {
    this.apiService.updateTemplate({
      id: this.selectedTemplate.id,
      title: this.title,
      type: this.type,
      subject: this.subject,
      body: this.body,
    }, res => this.dialogRef.close(res));
  }
}
