import { Injectable } from '@angular/core';


const URL = 'http://localhost:8080/';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor() {}

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
      .catch(error => alert('unexpected API error: ' + error.toString()));
  }

}
