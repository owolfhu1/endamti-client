import { Injectable } from '@angular/core';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  username;

  constructor(private router: Router) { }

  public logout() {
    this.username = null;
    this.router.navigate(['/login']);
  }

}
