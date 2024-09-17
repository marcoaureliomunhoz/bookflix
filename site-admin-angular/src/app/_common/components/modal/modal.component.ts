import { AfterViewInit, Component, ElementRef, Input, output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent implements AfterViewInit {
  @Input() title = '';
  onClose = output<void>();
  @ViewChild('body') body?: ElementRef;
  @ViewChild('footer') footer?: ElementRef;

  ngAfterViewInit(): void {
    const footerContent = this.footer?.nativeElement?.innerHTML;
    if (!footerContent && this.body && this.footer) {
      this.body.nativeElement.classList.add('body-full');
      this.footer.nativeElement.classList.add('hidden');
    }
  }
}
