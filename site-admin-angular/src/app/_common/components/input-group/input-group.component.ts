import { Component, Input, OnInit, output, ViewContainerRef } from '@angular/core';

export interface Action {
  name: string;
  text: string;
}

@Component({
  selector: 'app-input-group',
  standalone: true,
  imports: [],
  templateUrl: './input-group.component.html',
  styleUrl: './input-group.component.scss'
})
export class InputGroupComponent implements OnInit {
  id?: string;
  @Input() label?: string;
  @Input() width?: string;
  @Input() actions?: Action[] = [];
  onAction = output<string>();

  constructor(private vcref: ViewContainerRef) {}

  ngOnInit(): void {
    const self = this.vcref?.element?.nativeElement;
    if (this.width && self) {
      self.style.width = this.width;
    }
    this.id = self?.querySelector('input')?.getAttribute('id');
  }
}
