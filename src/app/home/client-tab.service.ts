import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Tab } from '../model/tab.model';
import { ClientSummaryComponent } from './client-summary/client-summary.component';

@Injectable({
  providedIn: 'root'
})
export class ClientTabService {
  tabs: Tab[] = [ new Tab(ClientSummaryComponent, 'Summary', {}, false)];
  tabSub = new BehaviorSubject<Tab[]>(this.tabs);

  constructor() { }

  removeTab(index: number): void {
    this.tabs.splice(index, 1);
    this.tabs[this.tabs.length - 1].active = true;
    this.tabSub.next(this.tabs);
  }

  public addTab(tab: Tab) {
    this.tabs.forEach(t => t.active = false);
    tab.id = this.tabs.length + 1;
    tab.active = true;
    this.tabs.push(tab);
    this.tabSub.next(this.tabs);
  }
}
