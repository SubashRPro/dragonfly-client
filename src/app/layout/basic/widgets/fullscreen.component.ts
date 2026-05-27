import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import * as screenfull from 'screenfull';

@Component({
  selector: 'header-fullscreen',
  template: ` <img src="assets/images/fscreen.svg" /> `,
  host: {
    '[class.d-block]': 'true'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderFullScreenComponent {
  status = false;
  private get sf(): screenfull.Screenfull {
    return screenfull as screenfull.Screenfull;
  }

  @HostListener('window:resize')
  _resize(): void {
    this.status = this.sf.isFullscreen;
  }

  @HostListener('click')
  _click(): void {
    if (this.sf.isEnabled) {
      this.sf.toggle();
    }
  }
}
