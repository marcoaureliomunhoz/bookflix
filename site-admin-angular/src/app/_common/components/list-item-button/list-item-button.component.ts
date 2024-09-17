import { CommonModule } from '@angular/common';
import { Component, Input, output } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-list-item-button',
  standalone: true,
  imports: [
    CommonModule, RouterOutlet, RouterLink, RouterLinkActive,
  ],
  templateUrl: './list-item-button.component.html',
  styleUrl: './list-item-button.component.scss'
})
export class ListItemButtonComponent {
  @Input() type?: 'link' | 'button';
  @Input() text: string = '';
  @Input() color: string = 'blue';
  @Input() link: any[] = [];
  onClick = output();
}
