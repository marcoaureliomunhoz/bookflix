import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-bagde',
  standalone: true,
  imports: [],
  templateUrl: './bagde.component.html',
  styleUrl: './bagde.component.scss'
})
export class BagdeComponent {
  @Input() caption = 'caption';
  @Input() text = 'text';
}
