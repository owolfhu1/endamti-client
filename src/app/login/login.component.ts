import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../services/api.service';
import {Router} from '@angular/router';
import {UserService} from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  nameCtrl: FormControl;
  passCtrl: FormControl;
  message;

  constructor(
    private dialog: MatDialog,
    private apiService: ApiService,
    private router: Router,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.initControls();
  }

  initControls() {
    this.nameCtrl = new FormControl('', [Validators.required]);
    this.passCtrl = new FormControl('', [Validators.required]);
  }

  login(): void {
    if (this.passCtrl.valid && this.nameCtrl.valid) {
      this.apiService.login(this.nameCtrl.value, this.userService.hashPass(this.passCtrl.value), success => {
        if (!success) {
          this.message = 'Bad user name and/or password';
        } else {
          this.userService.username = this.nameCtrl.value;
          this.router.navigate(['/home']);
        }
      });
    } else {
      this.passCtrl.markAsTouched();
      this.nameCtrl.markAsTouched();
    }
  }

  register(): void {
    this.dialog.open(RegisterDialogComponent, { width: '400px' });
  }

}

@Component({
  selector: 'app-register-dialog',
  template: `
    <div style="text-align: center">
      <h1>{{ header }}</h1>
      <h3>{{ message }}</h3>

      <div *ngIf="!success">
        <mat-form-field class="full">
          <mat-label>User Name</mat-label>
          <input type="text" matInput [formControl]="nameCtrl" placeholder="User Name">
          <mat-error *ngIf="nameCtrl.hasError('required')">
            User Name is required
          </mat-error>
        </mat-form-field>

        <mat-form-field class="full">
          <mat-label>Email</mat-label>
          <input type="email" matInput [formControl]="emailCtrl" placeholder="email@example.com">
          <mat-error *ngIf="emailCtrl.hasError('required')">
            Email is required
          </mat-error>
          <mat-error *ngIf="!emailCtrl.hasError('required') && emailCtrl.hasError('email')">
            Please enter a valid email address
          </mat-error>
        </mat-form-field>

        <mat-form-field class="full">
          <mat-label>Password</mat-label>
          <input type="password" matInput [formControl]="passCtrl" placeholder="Password">
          <mat-error *ngIf="passCtrl.hasError('required')">
            Password is required
          </mat-error>
        </mat-form-field>
      </div>

      <br *ngIf="!success"><br *ngIf="!success">
      <button *ngIf="!success" class="full" (click)="register()" color="primary" mat-raised-button>Submit</button>
      <br><br>
      <button class="full" (click)="dialogRef.close()" [color]="success ? 'accent' : 'warn'" mat-raised-button>
        {{ success ? 'Close' : 'Cancel' }}
      </button>
    </div>
  `
})
export class RegisterDialogComponent {
  header = 'Endamti Registration';
  message = 'Complete form and submit to register a new user';
  success = false;
  nameCtrl: FormControl;
  passCtrl: FormControl;
  emailCtrl: FormControl;

  constructor(
    public dialogRef: MatDialogRef<RegisterDialogComponent>,
    private apiService: ApiService,
    private userService: UserService,
  ) {
    this.nameCtrl = new FormControl('', [Validators.required]);
    this.passCtrl = new FormControl('', [Validators.required]);
    this.emailCtrl = new FormControl('', [Validators.required, Validators.email]);
  }

  register() {
    if (this.passCtrl.valid && this.nameCtrl.valid && this.emailCtrl.valid) {
      this.apiService.register(this.nameCtrl.value, this.userService.hashPass(this.passCtrl.value), this.emailCtrl.value, success => {
        if (success) {
          this.success = true;
          this.header = 'Success!';
          this.message = `You have registered the user ${this.nameCtrl.value} with email ${this.emailCtrl.value}`;
        } else {
          this.message = `The user name ${this.nameCtrl.value} is unavailable, please try another user name.`;
        }
      });
    } else {
      this.passCtrl.markAsTouched();
      this.nameCtrl.markAsTouched();
      this.emailCtrl.markAsTouched();
    }
  }
}
