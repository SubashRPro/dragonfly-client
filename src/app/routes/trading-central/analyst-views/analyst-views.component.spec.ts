import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalystViewsComponent } from './analyst-views.component';

describe('AnalystViewsComponent', () => {
  let component: AnalystViewsComponent;
  let fixture: ComponentFixture<AnalystViewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalystViewsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalystViewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
