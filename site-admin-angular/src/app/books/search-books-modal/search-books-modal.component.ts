import { Component, Input, OnInit, output } from '@angular/core';
import { Book } from '../book.model';
import { BooksService } from '../books.service';
import { ListItemComponent } from '../../_common/components/list/list-item.component';
import { ListItemButtonComponent } from '../../_common/components/list-item-button/list-item-button.component';
import { ModalComponent } from '../../_common/components/modal/modal.component';
import { BagdeComponent } from '../../_common/components/bagde/bagde.component';

@Component({
  selector: 'app-search-books-modal',
  standalone: true,
  imports: [
    ModalComponent, ListItemButtonComponent, ListItemComponent,
    BagdeComponent
  ],
  templateUrl: './search-books-modal.component.html',
  styleUrl: './search-books-modal.component.scss'
})
export class SearchBooksModalComponent implements OnInit {
  @Input() visible = false;
  onSelect = output<Book>();
  onClose = output();

  list: Book[]  = [];

  constructor(private mainService: BooksService) {}

  ngOnInit(): void {
    this.getList();
  }

  getList() {
    this.mainService.list().subscribe(data => {
      this.list = data.list || [];
    });
  }

  clickCloseButton() {
    this.onClose.emit();
  }
}
