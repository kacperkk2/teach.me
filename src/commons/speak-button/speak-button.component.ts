import { Component, HostListener, Input, NgZone, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-speak-button',
  templateUrl: './speak-button.component.html',
  styleUrl: './speak-button.component.scss'
})
export class SpeakButtonComponent implements OnDestroy {

  @Input({required: true}) text: string;
  @Input({required: true}) language: string;

  speakState: 'idle' | 'normal' | 'slow' = 'idle';
  private longPressTimer: any = null;

  constructor(private zone: NgZone) {}

  @HostListener('mousedown', ['$event'])
  onMouseDown(e: Event) { e.stopPropagation(); this.onPressStart(); }

  @HostListener('mouseup', ['$event'])
  onMouseUp(e: Event) { e.stopPropagation(); this.onPressEnd(); }

  @HostListener('mouseleave', ['$event'])
  onMouseLeave(e: Event) { e.stopPropagation(); this.onPressCancel(); }

  @HostListener('touchstart', ['$event'])
  onTouchStart(e: Event) { e.preventDefault(); e.stopPropagation(); this.onPressStart(); }

  @HostListener('touchend', ['$event'])
  onTouchEnd(e: Event) { e.stopPropagation(); this.onPressEnd(); }

  @HostListener('touchcancel', ['$event'])
  onTouchCancel(e: Event) { e.stopPropagation(); this.onPressCancel(); }

  @HostListener('touchmove', ['$event'])
  onTouchMove(e: Event) { e.stopPropagation(); this.onPressCancel(); }

  @HostListener('click', ['$event'])
  onClick(e: Event) { e.stopPropagation(); }

  onPressStart() {
    this.longPressTimer = setTimeout(() => {
      this.longPressTimer = null;
      this.speak(0.5);
    }, 400);
  }

  onPressEnd() {
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
      this.speak(1);
    }
  }

  onPressCancel() {
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }
  }

  private speak(rate: number) {
    if (!('speechSynthesis' in window)) return;
    const cleanText = this.text.replace(/\(.*?\)/g, '').replace(/\[.*?\]/g, '').trim();
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = this.language;
    utterance.rate = rate;
    this.speakState = rate < 1 ? 'slow' : 'normal';
    utterance.onend = () => this.zone.run(() => this.speakState = 'idle');
    utterance.onerror = () => this.zone.run(() => this.speakState = 'idle');
    window.speechSynthesis.speak(utterance);
  }

  ngOnDestroy() {
    clearTimeout(this.longPressTimer);
    window.speechSynthesis.cancel();
  }
}
