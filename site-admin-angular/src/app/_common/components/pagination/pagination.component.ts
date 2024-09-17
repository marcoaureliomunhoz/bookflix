import { Component, Input, output } from '@angular/core';
import { Pagination } from '../../models/Pagination';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent {
  @Input() pagination?: Pagination|null;
  onChange = output<number>();
}
