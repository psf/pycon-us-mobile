import { Component, Input, OnDestroy, AfterViewInit } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-scroll-to-top',
  templateUrl: './scroll-to-top.component.html',
  styleUrls: ['./scroll-to-top.component.scss'],
  // ion-content's slot="fixed" only honors DIRECT children. The inner
  // ion-fab is two levels deep (app-scroll-to-top > ion-fab), so put the
  // slot on the host element so Ionic anchors the whole component.
  host: { slot: 'fixed' },
})
export class ScrollToTopComponent implements AfterViewInit, OnDestroy {
  @Input() content?: IonContent;
  @Input() threshold = 400;
  @Input() duration = 300;

  visible = false;

  private scrollSub?: Subscription;

  ngAfterViewInit(): void {
    if (!this.content) {
      return;
    }
    this.scrollSub = this.content.ionScroll.subscribe((ev: CustomEvent) => {
      const scrollTop = ev?.detail?.scrollTop ?? 0;
      this.visible = scrollTop > this.threshold;
    });
  }

  ngOnDestroy(): void {
    this.scrollSub?.unsubscribe();
  }

  scrollToTop(): void {
    this.content?.scrollToTop(this.duration);
  }
}
