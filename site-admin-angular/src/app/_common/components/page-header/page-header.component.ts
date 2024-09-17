import { Component, Input, output } from '@angular/core';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [],
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.scss'
})
export class PageHeaderComponent {
  @Input() title = '';
  @Input() buttons: PageHeaderInputButton[] = [];
  onClickButton = output<string>();

  buttonClick(name: string) {
    this.onClickButton.emit(name);
  }
}

export interface PageHeaderInputButton {
  name: string;
  content: string;
  disabled?: boolean;
}
