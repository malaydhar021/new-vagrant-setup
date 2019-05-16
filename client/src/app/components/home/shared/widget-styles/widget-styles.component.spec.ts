import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetStylesComponent } from './widget-styles.component';

describe('WidgetStylesComponent', () => {
  let component: WidgetStylesComponent;
  let fixture: ComponentFixture<WidgetStylesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetStylesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetStylesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
