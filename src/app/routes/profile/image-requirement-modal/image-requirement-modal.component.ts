import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-image-requirement-modal',
  templateUrl: './image-requirement-modal.component.html',
  styleUrls: ['./image-requirement-modal.component.less']
})
export class ImageRequirementModalComponent implements OnInit {
  isVisible = false;
  constructor() {}

  ngOnInit(): void {
    console.log();
  }

  showModal() {
    this.isVisible = true;
  }

  handleCancel(): void {
    this.isVisible = false;
  }
}
