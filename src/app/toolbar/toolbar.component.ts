import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/services/user.service';
import { Router } from '@angular/router';
import { EmailService } from '../shared/services/email.service';
import { SmsService } from '../shared/services/sms.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  constructor(
    public userService: UserService,
    private router: Router,
    private emailService: EmailService,
    private smsService: SmsService,
  ) { }

  ngOnInit(): void {
  }

  navigate(destination) {
    this.router.navigate([`/${destination}`]);
  }

  email() {
    this.emailService.sendEmail();
  }

  sms() {
    this.smsService.sendSMS();
  }
}
