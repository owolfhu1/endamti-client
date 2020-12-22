import { Type } from '@angular/core';

export class Tab {
  id: number;
  title: string;
  data: any;
  active; boolean;
  component: Type<any>;
  closable: boolean;
  clientId: number;

  constructor(component: Type<any>, title: string, clientId: number, data?: any, closable = true) {
    this.data = data;
    this.title = title;
    this.component = component;
    this.closable = closable;
    this.clientId = clientId;
  }
}
