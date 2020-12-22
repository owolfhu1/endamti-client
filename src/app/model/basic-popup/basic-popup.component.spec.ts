import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicPopupComponent } from './basic-popup.component';

describe('BasicPopupComponent', () => {
  let component: BasicPopupComponent;
  let fixture: ComponentFixture<BasicPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
