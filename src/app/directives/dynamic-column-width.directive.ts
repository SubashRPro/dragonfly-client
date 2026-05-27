import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appDynamicColumnWidth]'
})
export class DynamicColumnWidthDirective {
  public elem = null;
  public mouseDown: boolean = false;
  public oldX: number = 0;
  public oldWidth: number = 0;
  public width: number = 0;

  constructor(private el: ElementRef) {}
  @HostListener('mousedown', ['$event'])
  onMousedown(e: any) {
    // 判断当前点击的是否是单元格元素
    if (this.el != null) {
      if (e.offsetX > this.el.nativeElement.offsetWidth - 15) {
        this.el.nativeElement.mouseDown = true;
        this.el.nativeElement.oldX = e.x;
        this.el.nativeElement.oldWidth = this.el.nativeElement.offsetWidth;
      }
    } else {
      //
    }
  }
  @HostListener('mouseup', ['$event'])
  onMouseup(e: any) {
    if (this.el != null) {
      this.el.nativeElement.mouseDown = false;
      this.el.nativeElement.style.cursor = 'default';
    }
  }
  @HostListener('mousemove', ['$event'])
  onMousemove(e: any) {
    if (this.el != null) {
      if (e.offsetX > this.el.nativeElement.offsetWidth - 15) {
        this.el.nativeElement.style.cursor = 'col-resize';
      } else {
        this.el.nativeElement.style.cursor = 'default';
      }
    }

    if (this.el.nativeElement.mouseDown != null && this.el.nativeElement.mouseDown == true) {
      this.el.nativeElement.style.cursor = 'default';
      let wid = 0;
      if (this.el.nativeElement.oldWidth + (e.x - this.el.nativeElement.oldX) > 0) {
        wid = this.el.nativeElement.oldWidth + (e.x - this.el.nativeElement.oldX);
      }
      this.el.nativeElement.style.width = `${wid}px`;
      this.el.nativeElement.style.cursor = 'col-resize';
    } else {
      //
    }
  }
}
