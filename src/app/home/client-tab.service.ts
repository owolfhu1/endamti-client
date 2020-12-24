import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Tab } from '../shared/models/tab.model';
import { ClientSummaryComponent } from './client-summary/client-summary.component';

@Injectable({
  providedIn: 'root'
})
export class ClientTabService {
  tabs: Tab[] = [ new Tab(ClientSummaryComponent, 'Summary', null, {}, false) ];
  tabSub = new BehaviorSubject<Tab[]>(this.tabs);
  refreshSummary = new BehaviorSubject<void>(null);

  constructor() {
    this.refreshSummary.subscribe(() => {
      this.tabs.forEach(t => t.active = false);
      this.tabs[0].active = true;
    });
  }

  removeTab(index: number): void {
    this.tabs.splice(index, 1);
    this.tabs[this.tabs.length - 1].active = true;
    this.tabSub.next(this.tabs);
  }

  removeById(clientId): void {
    const index = this.tabs.map(tab => tab.clientId).indexOf(clientId);
    if (index > -1) {
      this.removeTab(index);
    }
  }

  addTab(tab: Tab) {
    this.removeById(tab.clientId);
    this.tabs.forEach(t => t.active = false);
    tab.id = this.tabs.length + 1;
    tab.active = true;
    this.tabs.push(tab);
    this.tabSub.next(this.tabs);
  }
}
