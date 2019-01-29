import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StickyReviewsComponent } from './sticky-reviews.component';

describe('StickyReviewsComponent', () => {
  let component: StickyReviewsComponent;
  let fixture: ComponentFixture<StickyReviewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StickyReviewsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StickyReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
