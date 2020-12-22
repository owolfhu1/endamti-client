import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {ApiService} from '../../services/api.service';
import {ClientTabService} from '../client-tab.service';
import {Tab} from '../../model/tab.model';
import {ViewClientComponent} from '../view-client/view-client.component';

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.css']
})
export class ClientFormComponent implements OnInit {

  @Input() data;
  @Input() title;

  form: FormGroup;
  firstnameCtrl: FormControl;
  lastnameCtrl: FormControl;
  emailCtrl: FormControl;
  phoneCtrl: FormControl;
  otherPhoneCtrl: FormControl;
  canSmsCtrl: FormControl;
  organizationCtrl: FormControl;
  prefixCtrl: FormControl;
  streetCtrl: FormControl;
  cityCtrl: FormControl;
  stateCtrl: FormControl;
  zipCtrl: FormControl;
  entryDateCtrl: FormControl;
  lastVisitCtrl: FormControl;
  visitsCtrl: FormControl;
  balanceCtrl: FormControl;
  optInCtrl: FormControl;
  activeCtrl: FormControl;
  titleCtrl: FormControl;
  genderCtrl: FormControl;
  statusCtrl: FormControl;
  notificationByCtrl: FormControl;

  constructor(private apiService: ApiService, private clientTabService: ClientTabService) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.firstnameCtrl = new FormControl(this.data?.firstname);
    this.lastnameCtrl = new FormControl(this.data?.lastname);
    this.emailCtrl = new FormControl(this.data?.email);
    this.phoneCtrl = new FormControl(this.data?.phone);
    this.otherPhoneCtrl = new FormControl(this.data?.otherPhone);
    this.canSmsCtrl = new FormControl(this.data?.canSms);
    this.organizationCtrl = new FormControl(this.data?.organization);
    this.prefixCtrl = new FormControl(this.data?.prefix);
    this.streetCtrl = new FormControl(this.data?.street);
    this.cityCtrl = new FormControl(this.data?.city);
    this.stateCtrl = new FormControl(this.data?.state);
    this.zipCtrl = new FormControl(this.data?.zip);
    this.entryDateCtrl = new FormControl(this.data?.entryDate ? new Date(this.data.entryDate) : null);
    this.lastVisitCtrl = new FormControl(this.data?.lastVisit ? new Date(this.data.lastVisit) : null);
    this.visitsCtrl = new FormControl(this.data?.visits || 0);
    this.balanceCtrl = new FormControl(this.data?.balance || 0);
    this.optInCtrl = new FormControl(this.data?.optIn);
    this.activeCtrl = new FormControl(this.data?.active);
    this.titleCtrl = new FormControl(this.data?.title);
    this.genderCtrl = new FormControl(this.data?.gender);
    this.statusCtrl = new FormControl(this.data?.status || 'PENDING');
    this.notificationByCtrl = new FormControl(this.data?.notificationBy);

    this.form = new FormGroup({
      firstname: this.firstnameCtrl,
      lastname: this.lastnameCtrl,
      email: this.emailCtrl,
      phone: this.phoneCtrl,
      otherPhone: this.otherPhoneCtrl,
      canSms: this.canSmsCtrl,
      organization: this.organizationCtrl,
      prefix: this.prefixCtrl,
      street: this.streetCtrl,
      city: this.cityCtrl,
      state: this.stateCtrl,
      zip: this.zipCtrl,
      entryDate: this.entryDateCtrl,
      lastVisit: this.lastVisitCtrl,
      visits: this.visitsCtrl,
      balance: this.balanceCtrl,
      optIn: this.optInCtrl,
      active: this.activeCtrl,
      title: this.titleCtrl,
      gender: this.genderCtrl,
      status: this.statusCtrl,
      notificationBy: this.notificationByCtrl,
    });
  }

  get body() {
    const json: any = {
      firstname: this.firstnameCtrl.value,
      lastname: this.lastnameCtrl.value,
      email: this.emailCtrl.value,
      phone: this.phoneCtrl.value,
      otherPhone: this.otherPhoneCtrl.value,
      canSms: !!this.canSmsCtrl.value,
      organization: this.organizationCtrl.value,
      prefix: this.prefixCtrl.value,
      street: this.streetCtrl.value,
      city: this.cityCtrl.value,
      state: this.stateCtrl.value,
      zip: this.zipCtrl.value,
      entryDate: this.entryDateCtrl.value ? new Date(this.entryDateCtrl.value).toISOString() : null,
      lastVisit: this.lastVisitCtrl.value ? new Date(this.lastVisitCtrl.value).toISOString() : null,
      visits: this.visitsCtrl.value || 0,
      balance: this.balanceCtrl.value || 0,
      optIn: !!this.optInCtrl.value,
      active: !!this.activeCtrl.value,
      title: this.titleCtrl.value,
      gender: this.genderCtrl.value,
      status: this.statusCtrl.value,
      notificationBy: this.notificationByCtrl.value,
    };
    if (this.data) {
      json.id = this.data.id;
    }
    return json;
  }

  submit() {
    if (!this.data?.id) {
      this.apiService.addClient(this.body, res => {
        this.clientTabService.removeById(-1);
        this.clientTabService.refreshSummary.next();
      });
    } else {
      this.apiService.updateClient(this.body, res => {
        this.clientTabService.removeById(this.data.id);
        this.clientTabService.refreshSummary.next();
      });
    }
  }

  view() {
    this.clientTabService.addTab(new Tab(
      ViewClientComponent,
      `View Client #${this.data.id} ${this.data.firstname || ''} ${this.data.lastname || ''}`,
      this.data.id,
      this.data,
    ));
  }

  delete() {
    this.apiService.deleteClient(this.data.id, () => {
      this.clientTabService.removeById(this.data.id);
      this.clientTabService.refreshSummary.next();
    });
  }
}
