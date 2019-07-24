import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscribedEmailsComponent } from './subscribed-emails.component';

describe('SubscribedEmailsComponent', () => {
  let component: SubscribedEmailsComponent;
  let fixture: ComponentFixture<SubscribedEmailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscribedEmailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscribedEmailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
