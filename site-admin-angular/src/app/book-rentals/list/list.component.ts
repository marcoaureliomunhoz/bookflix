import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { PageHeaderComponent } from '../../_common/components/page-header/page-header.component';
import { PageBodyComponent } from '../../_common/components/page-body/page-body.component';
import { PageFooterComponent } from '../../_common/components/page-footer/page-footer.component';
import { ListItemButtonComponent } from '../../_common/components/list-item-button/list-item-button.component';
import { ListItemComponent } from '../../_common/components/list/list-item.component';
import { BookRentalForList } from '../book-rental.model';
import { BookRentalsService } from '../book-rentals.service';
import moment from 'moment';
import { BagdeComponent } from '../../_common/components/bagde/bagde.component';
import { Pagination } from '../../_common/models/Pagination';
import { PaginationComponent } from '../../_common/components/pagination/pagination.component';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    CommonModule, RouterOutlet, RouterLink, RouterLinkActive,
    PageHeaderComponent, PageBodyComponent, PageFooterComponent,
    ListItemButtonComponent, ListItemComponent, BagdeComponent, PaginationComponent
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit {

  mainList: BookRentalForList[] = [];
  pagination?: Pagination | null;
  page = 1;
  pageSize = 5;
  buttons = {
    Add: 'add'
  };

  constructor(
    private readonly router: Router,
    private readonly mainService: BookRentalsService
  ) {}

  ngOnInit() {
    this.getMainList();
  }

  private getMainList() {
    this.mainService.list(this.page, this.pageSize).subscribe(data => {
      this.mainList = data.list.map(item => ({
        id: item.id,
        bookId: item.bookId,
        creationDate: item.creationDate,
        customerId: item.customerId,
        maxReturnDate: item.maxReturnDate,
        returnDate: item.returnDate,
        customerName: item.customerName,
        bookTitle: item.bookTitle,
        formattedMaxReturnDate: moment(item.maxReturnDate).utc().format('YYYY-MM-DD'),
        formattedReturnDate: item.returnDate ? moment(item.returnDate).utc().format('YYYY-MM-DD') : null
      }));
      this.pagination = {
        page: data.pagination.page,
        pageSize: data.pagination.pageSize,
        listSize: data.pagination.listSize,
        numberOfPages: data.pagination.numberOfPages
      }
      if (this.mainList.length == 0 && this.page > 1) {
        this.page = data.pagination.numberOfPages && this.page >= data.pagination.numberOfPages ? this.page - 1 : 1;
        this.getMainList();
      }
    });
  }

  clickHeaderButton(buttonName: string) {
    if (buttonName === this.buttons.Add) {
      this.router.navigate([`/book-rentals/add`]);
      return;
    }
  }

  return(id: number) {
    this.mainService.return(id).subscribe(data => {
      this.mainList = this.mainList.map(item => {
        if (item.id === id) {
          return {
            ...item,
            returnDate: data.returnDate,
            formattedReturnDate: data.returnDate ? moment(data.returnDate).utc().format('YYYY-MM-DD') : null
          };
        }
        return item;
      })
    });
  }

  changePage(page: number) {
    this.page = page;
    this.getMainList();
  }
}
