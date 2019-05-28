import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TearDropElevatedComponent } from './tear-drop-elevated.component';

describe('TearDropElevatedComponent', () => {
  let component: TearDropElevatedComponent;
  let fixture: ComponentFixture<TearDropElevatedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TearDropElevatedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TearDropElevatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
