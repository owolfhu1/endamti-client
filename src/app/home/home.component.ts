import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { Tab } from '../model/tab.model';
import {ClientTabService} from './client-tab.service';
import {AddClientComponent} from './add-client/add-client.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  tabs: Tab[] = [];
  selectedTab: number;

  constructor(private clientTabService: ClientTabService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.clientTabService.tabSub.subscribe(tabs => {
      this.tabs = tabs;
      this.selectedTab = tabs.findIndex(tab => tab.active);
      this.cdr.detectChanges();
    });
  }

  tabChanged(event) {
    // console.log('tab changed', event);
  }

  addNewTab(component, title, data, closable) {
    this.clientTabService.addTab(new Tab(component, title, data, closable));
  }

  removeTab(index: number) {
    this.clientTabService.removeTab(index);
  }

  addClient() {
    this.clientTabService.addTab(new Tab(AddClientComponent, 'Add Client', { type: 'add' }));
  }
}
