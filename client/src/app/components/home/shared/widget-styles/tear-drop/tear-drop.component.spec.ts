import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TearDropComponent } from './tear-drop.component';

describe('TearDropComponent', () => {
  let component: TearDropComponent;
  let fixture: ComponentFixture<TearDropComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TearDropComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TearDropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
