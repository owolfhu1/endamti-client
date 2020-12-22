import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent, RegisterDialogComponent } from './login/login.component';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import { HomeComponent } from './home/home.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatMenuModule} from '@angular/material/menu';
import {MatTabsModule} from '@angular/material/tabs';
import { ClientSummaryComponent } from './home/client-summary/client-summary.component';
import { ContentContainerDirective } from './directive/content-container.directive';
import { TabContentComponent } from './model/tab-content/tab-content.component';
import {MatTableModule} from '@angular/material/table';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { ClientFormComponent } from './home/client-form/client-form.component';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatPaginatorModule} from '@angular/material/paginator';
import { BasicPopupComponent } from './model/basic-popup/basic-popup.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import { ViewClientComponent } from './home/view-client/view-client.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterDialogComponent,
    HomeComponent,
    ToolbarComponent,
    ClientSummaryComponent,
    ContentContainerDirective,
    TabContentComponent,
    ClientFormComponent,
    BasicPopupComponent,
    ViewClientComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatMenuModule,
    MatTabsModule,
    MatTableModule,
    MatCheckboxModule,
    FormsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatTooltipModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    RegisterDialogComponent,
  ]
})
export class AppModule { }
