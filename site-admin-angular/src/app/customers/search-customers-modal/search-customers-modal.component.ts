import { Component, Input, OnInit, output } from '@angular/core';
import { ModalComponent } from '../../_common/components/modal/modal.component';
import { Customer } from '../customer.model';
import { CustomersService } from '../customers.service';
import { ListItemComponent } from '../../_common/components/list/list-item.component';
import { ListItemButtonComponent } from '../../_common/components/list-item-button/list-item-button.component';

@Component({
  selector: 'app-search-customers-modal',
  standalone: true,
  imports: [
    ModalComponent, ListItemButtonComponent, ListItemComponent
  ],
  templateUrl: './search-customers-modal.component.html',
  styleUrl: './search-customers-modal.component.scss'
})
export class SearchCustomersModalComponent implements OnInit {
  @Input() visible = false;
  onSelect = output<Customer>();
  onClose = output();

  list: Customer[]  = [];

  constructor(private mainService: CustomersService) {}

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
