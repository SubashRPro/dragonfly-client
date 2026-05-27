import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-crypto-wallet',
  templateUrl: './crypto-wallet.component.html',
  styleUrls: ['./crypto-wallet.component.less']
})
export class CryptoWalletComponent implements OnInit {
  isVisible = false;
  validateForm!: FormGroup;
  @Output() readonly toParent = new EventEmitter();
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    console.log();
  }
  showModal(params: any): void {
    this.isVisible = true;
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }
}
