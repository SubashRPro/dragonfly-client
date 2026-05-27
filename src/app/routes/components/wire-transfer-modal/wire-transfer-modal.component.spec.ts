import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WireTransferModalComponent } from './wire-transfer-modal.component';

describe('WireTransferModalComponent', () => {
  let component: WireTransferModalComponent;
  let fixture: ComponentFixture<WireTransferModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WireTransferModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WireTransferModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
