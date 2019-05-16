import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayPictureComponent } from './display-picture.component';

describe('DisplayPictureComponent', () => {
  let component: DisplayPictureComponent;
  let fixture: ComponentFixture<DisplayPictureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayPictureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayPictureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
