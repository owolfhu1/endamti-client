import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  refreshCommunication: BehaviorSubject<void> = new BehaviorSubject(null);
  constructor() { }
}
