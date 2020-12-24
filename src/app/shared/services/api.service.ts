import { Injectable } from '@angular/core';
import {
  ClientSearchParams,
  CommunicationSearchParams,
  EmailDTO,
  SMSDTO,
  Template,
} from '../models/api.model';
import { MatDialog } from '@angular/material/dialog';
import { BasicPopupComponent } from '../components/basic-popup/basic-popup.component';

const URL = 'http://localhost:8080/';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private dialog: MatDialog) {}

  login(username, password, callback) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    fetch(URL + 'users/login', {
      method: 'POST',
      mode: 'cors',
      headers,
      body: JSON.stringify({ username, password })
    }).then(response => response.json())
      .then(callback)
      .catch(error => alert('unexpected API error: ' + error.toString()));
  }

  register(username, password, email, callback) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    fetch(URL + 'users/register', {
      method: 'POST',
      mode: 'cors',
      headers,
      body: JSON.stringify({ username, password, email })
    }).then(response => response.json())
      .then(callback)
      .catch(error => console.log('unexpected API error: ' + error.toString()));
  }

  clientSearch(params: ClientSearchParams, callback) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    fetch(URL + 'clients/search', {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(params),
      headers,
    }).then(response => response.json())
      .then(callback)
      .catch(error => console.log('unexpected API error: ' + error.toString()));
  }

  addClient(body: any, callback) {
    console.log('adding client', body);
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    fetch(URL + 'clients/add', {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(body),
      headers,
    }).then(response => response.json())
      .then(callback)
      .catch(error => console.log('unexpected API error: ' + error.toString()));
  }

  updateClient(body: any, callback) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    fetch(URL + 'clients/update', {
      method: 'PUT',
      mode: 'cors',
      body: JSON.stringify(body),
      headers,
    }).then(response => response.json())
      .then(callback)
      .catch(error => console.log('unexpected API error: ' + error.toString()));
  }

  deleteClient(id: number, callback) {
    const dialog = this.dialog.open(BasicPopupComponent, {
      width: '500px',
      data: {
        message: `You are about to permanently delete client #${id}, do you wish to continue?`,
        title: 'Delete Client',
        continue: 'Yes',
        cancel: 'No',
      }
    });

    dialog.afterClosed().subscribe(result => {
      if (result) {
        const headers = new Headers();
        fetch(URL + 'clients/delete?id=' + id, {
          method: 'DELETE',
          mode: 'cors',
          headers,
        }).then(response => response.text())
          .then(callback)
          .catch(error => console.log('unexpected API error: ' + error.toString()));
      }
    });
  }

  activateClient(id: number, callback) {
    const headers = new Headers();
    fetch(URL + 'clients/activate?id=' + id, {
      method: 'PUT',
      mode: 'cors',
      headers,
    }).then(response => response.text())
      .then(callback)
      .catch(error => console.log('unexpected API error: ' + error.toString()));
  }

  getClient(id: number, callback) {
    const headers = new Headers();
    fetch(URL + 'clients/get?id=' + id, {
      method: 'GET',
      mode: 'cors',
      headers,
    }).then(response => response.json())
      .then(callback)
      .catch(error => console.log('unexpected API error: ' + error.toString()));
  }

  getClientsWithEmail(callback) {
    const headers = new Headers();
    fetch(URL + 'clients/emails', {
      method: 'GET',
      mode: 'cors',
      headers,
    }).then(response => response.json())
      .then(callback)
      .catch(error => console.log('unexpected API error: ' + error.toString()));
  }

  getClientsWithSMS(callback) {
    const headers = new Headers();
    fetch(URL + 'clients/sms', {
      method: 'GET',
      mode: 'cors',
      headers,
    }).then(response => response.json())
      .then(callback)
      .catch(error => console.log('unexpected API error: ' + error.toString()));
  }

  sendEmail(body: EmailDTO, callback) {
    console.log('adding client', body);
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    fetch(URL + 'communication/email', {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(body),
      headers,
    }).then(response => response.text())
      .then(callback)
      .catch(error => console.log('unexpected API error: ' + error.toString()));
  }

  sendSMS(body: SMSDTO, callback) {
    console.log('adding client', body);
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    fetch(URL + 'communication/sms', {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(body),
      headers,
    }).then(response => response.text())
      .then(callback)
      .catch(error => console.log('unexpected API error: ' + error.toString()));
  }

  communicationSearch(params: CommunicationSearchParams, callback) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    fetch(URL + 'communication/search', {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(params),
      headers,
    }).then(response => response.json())
      .then(callback)
      .catch(error => console.log('unexpected API error: ' + error.toString()));
  }

  getTemplates(callback) {
    const headers = new Headers();
    fetch(URL + 'communication/template', {
      method: 'GET',
      mode: 'cors',
      headers,
    }).then(response => response.json())
      .then(callback)
      .catch(error => console.log('unexpected API error: ' + error.toString()));
  }

  addTemplate(template: Template, callback) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    fetch(URL + 'communication/template', {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(template),
      headers,
    }).then(response => response.json())
      .then(callback)
      .catch(error => console.log('unexpected API error: ' + error.toString()));
  }

  updateTemplate(template: Template, callback) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    fetch(URL + 'communication/template', {
      method: 'PUT',
      mode: 'cors',
      body: JSON.stringify(template),
      headers,
    }).then(response => response.text())
      .then(callback)
      .catch(error => console.log('unexpected API error: ' + error.toString()));
  }

  deleteTemplate(id: number, callback) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    fetch(URL + 'communication/template?id=' + id, {
      method: 'DELETE',
      mode: 'cors',
      headers,
    }).then(response => response.text())
      .then(callback)
      .catch(error => console.log('unexpected API error: ' + error.toString()));
  }
}
