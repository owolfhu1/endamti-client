import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ApiService} from '../../services/api.service';
import {Client} from '../../model/api.model';
import {ClientTabService} from '../client-tab.service';
import {Tab} from '../../model/tab.model';
import {ClientFormComponent} from '../client-form/client-form.component';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {ViewClientComponent} from '../view-client/view-client.component';

@Component({
  selector: 'app-client-summary',
  templateUrl: './client-summary.component.html',
  styleUrls: ['./client-summary.component.css']
})
export class ClientSummaryComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['actions', 'number', 'active', 'name', 'organization', 'entryDate', 'status'];
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  hideInactive = true;
  firstname: string;
  lastname: string;
  organization: string;
  status = 'ANY';

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    private apiService: ApiService,
    private clientTabService: ClientTabService,
    ) { }

  ngOnInit(): void {
    this.clientTabService.refreshSummary.subscribe(() => this.search());
  }

  reset(): void {
    this.firstname = null;
    this.lastname = null;
    this.organization = null;
    this.hideInactive = true;
    this.status = 'ANY';
    this.apiService.clientSearch({ hideInactive: true }, results => this.dataSource.data = results);
  }

  search(): void {
    this.apiService.clientSearch({
      hideInactive: this.hideInactive,
      firstname: this.firstname ? this.firstname : undefined,
      lastname: this.lastname ? this.lastname : undefined,
      organization: this.organization ? this.organization : undefined,
      status: this.status !== 'ANY' ? this.status : undefined,
    }, results => this.dataSource.data = results);
  }

  edit(client: Client) {
    this.clientTabService.addTab(new Tab(
      ClientFormComponent,
      `Edit Client #${client.id} ${client.firstname || ''} ${client.lastname || ''}`,
      client.id,
      client
    ));
  }

  copy(client: Client) {
    const oldId = client.id;
    client.id = undefined;
    this.clientTabService.addTab(new Tab(
      ClientFormComponent,
      `Copy Client #${oldId} ${client.firstname || ''} ${client.lastname || ''}`,
      -1,
      client
    ));
  }

  view(client: Client) {
    this.clientTabService.addTab(new Tab(
      ViewClientComponent,
      `View Client #${client.id} ${client.firstname || ''} ${client.lastname || ''}`,
      client.id,
      client
    ));
  }

  displayDate(dateString: string) {
    const date = new Date(dateString);
    return dateString ? date.toDateString() : '-';
  }

  delete(id: number) {
    this.apiService.deleteClient(id, () => {
      this.search();
    });
  }

  activate(id: number) {
    this.apiService.activateClient(id, () => {
      this.search();
    });
  }
}
