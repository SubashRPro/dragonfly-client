import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketBuzzComponent } from './market-buzz.component';

describe('MarketBuzzComponent', () => {
  let component: MarketBuzzComponent;
  let fixture: ComponentFixture<MarketBuzzComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarketBuzzComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketBuzzComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
