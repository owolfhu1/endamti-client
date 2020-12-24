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

  // minimal security so we are not storing passwords in plain text
  // todo add actual security >:-P
  public hashPass(str): string {
    let hash = 0;
    for (let i = 0; i < str.length; ++i) {
      // tslint:disable-next-line:no-bitwise
      hash = (Math.imul(31, hash) + str.charCodeAt(i)) | 0;
    }
    return hash + '';
  }

}
