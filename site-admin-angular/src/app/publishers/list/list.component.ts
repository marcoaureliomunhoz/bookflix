import { Component, OnInit } from '@angular/core';
import { PageHeaderComponent } from '../../_common/components/page-header/page-header.component';
import { PageFooterComponent } from '../../_common/components/page-footer/page-footer.component';
import { PageBodyComponent } from '../../_common/components/page-body/page-body.component';
import { PublishersService } from '../publishers.service';
import { Publisher } from '../publisher.model';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Alert } from '../../_common/services/alert.service';
import { ListItemButtonComponent } from '../../_common/components/list-item-button/list-item-button.component';
import { ListItemComponent } from '../../_common/components/list/list-item.component';
import { Pagination } from '../../_common/models/Pagination';
import { PaginationComponent } from '../../_common/components/pagination/pagination.component';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    CommonModule, RouterOutlet, RouterLink, RouterLinkActive,
    PageHeaderComponent, PageBodyComponent, PageFooterComponent,
    ListItemButtonComponent, ListItemComponent, PaginationComponent
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit {

  mainList: Publisher[] = [];
  pagination?: Pagination | null;
  page = 1;
  pageSize = 5;
  buttons = {
    Add: 'add'
  };

  constructor(
    private readonly router: Router,
    private readonly mainService: PublishersService,
    private readonly alert: Alert
  ) {}

  ngOnInit() {
    this.getMainList();
  }

  private getMainList() {
    this.mainService.list(null, this.page, this.pageSize).subscribe(data => {
      this.mainList = data.list.map(item => ({
        id: item.id,
        name: item.name,
        deletionDate: item.deletionDate
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
      this.router.navigate([`/publishers/add`]);
      return;
    }
  }

  async clickDeleteButton(publisherId?: number) {
    if (!publisherId) return;
    const response = await this.alert.confirm('Attention!', 'Do you really want to delete?');
    if (!response.isConfirmed) return;
    this.mainService.delete(publisherId).subscribe(data => {
      this.getMainList();
    });
  }

  changePage(page: number) {
    this.page = page;
    this.getMainList();
  }
}
