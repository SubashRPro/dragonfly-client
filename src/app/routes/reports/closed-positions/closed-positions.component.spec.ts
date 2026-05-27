import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClosedPositionsComponent } from './closed-positions.component';

describe('ClosedPositionsComponent', () => {
  let component: ClosedPositionsComponent;
  let fixture: ComponentFixture<ClosedPositionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClosedPositionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClosedPositionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
