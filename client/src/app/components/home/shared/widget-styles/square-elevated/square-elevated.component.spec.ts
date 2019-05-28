import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SquareElevatedComponent } from './square-elevated.component';

describe('SquareElevatedComponent', () => {
  let component: SquareElevatedComponent;
  let fixture: ComponentFixture<SquareElevatedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SquareElevatedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SquareElevatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
