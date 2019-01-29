import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticelabelComponent } from './noticelabel.component';

describe('NoticelabelComponent', () => {
  let component: NoticelabelComponent;
  let fixture: ComponentFixture<NoticelabelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoticelabelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticelabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
