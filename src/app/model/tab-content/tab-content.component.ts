import {Component, ComponentFactoryResolver, Input, OnInit, ViewChild} from '@angular/core';
import {Tab} from '../tab.model';
import {ContentContainerDirective} from '../../directive/content-container.directive';

@Component({
  selector: 'app-tab-content',
  template: '<ng-template appContentContainer></ng-template>',
})
export class TabContentComponent implements OnInit {
  @Input() tab;
  @ViewChild(ContentContainerDirective, { static: true })
  contentContainer: ContentContainerDirective;
  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}
  ngOnInit() {
    const tab: Tab = this.tab;
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(tab.component);
    const viewContainerRef = this.contentContainer.viewContainerRef;
    const componentRef = viewContainerRef.createComponent(componentFactory);
    (componentRef.instance as any).data = tab.data;
  }}
