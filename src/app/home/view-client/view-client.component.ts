import {Component, Input, OnInit} from '@angular/core';
import {Tab} from '../../model/tab.model';
import {ClientFormComponent} from '../client-form/client-form.component';
import {ClientTabService} from '../client-tab.service';
import {ApiService} from '../../services/api.service';

@Component({
  selector: 'app-view-client',
  templateUrl: './view-client.component.html',
  styleUrls: ['./view-client.component.css']
})
export class ViewClientComponent implements OnInit {
  @Input() data;
  @Input() title;

  constructor(private clientTabService: ClientTabService, private apiService: ApiService) { }

  ngOnInit(): void {
  }

  edit() {
    this.clientTabService.addTab(new Tab(
      ClientFormComponent,
      `Edit Client #${this.data.id} ${this.data.firstname || ''} ${this.data.lastname || ''}`,
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

  displayDate(dateString: string) {
    const date = new Date(dateString);
    return dateString ? date.toDateString() : '-';
  }
}
