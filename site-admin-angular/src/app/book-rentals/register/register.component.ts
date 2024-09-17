import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import moment from 'moment';
import { PageHeaderComponent } from '../../_common/components/page-header/page-header.component';
import { PageBodyComponent } from '../../_common/components/page-body/page-body.component';
import { PageFooterComponent } from '../../_common/components/page-footer/page-footer.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BookRentalsService } from '../book-rentals.service';
import { InputGroupComponent } from '../../_common/components/input-group/input-group.component';
import { Customer } from '../../customers/customer.model';
import { CustomersService } from '../../customers/customers.service';
import { Book } from '../../books/book.model';
import { BooksService } from '../../books/books.service';
import { SearchCustomersModalComponent } from '../../customers/search-customers-modal/search-customers-modal.component';
import { SearchBooksModalComponent } from '../../books/search-books-modal/search-books-modal.component';
import { Toast } from '../../_common/services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    PageHeaderComponent, PageBodyComponent, PageFooterComponent,
    InputGroupComponent,
    SearchCustomersModalComponent, SearchBooksModalComponent
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {

  @Input() id?: number|null = null;

  title: string = 'Register Book Retail';
  buttons = {
    Save: 'save'
  };
  form = this.formBuilder.group({
    maxReturnDate: ['', [Validators.required]],
    customerId: [0, [Validators.required, Validators.min(1)]],
    bookId: [0, [Validators.required, Validators.min(1)]]
  });
  customers: Customer[] = [];
  searchCustomersModalVisible = false;
  selectedCustomer?: Customer | null;
  books: Book[] = [];
  searchBooksModalVisible = false;
  selectedBook?: Book | null;

  constructor(
    private location: Location, private formBuilder: FormBuilder,
    private mainService: BookRentalsService, private customersService: CustomersService, private booksService: BooksService,
    private toast: Toast
  ) {}

  ngOnInit() {
    if (this.id) {
      this.title = 'Edit Book Rental';
      this.getMainData(this.id);
    } else {
      this.title = 'Add Book Rental';
    }
  }

  clickHeaderButton(buttonName: string) {
    if (buttonName === this.buttons.Save) {
      if (this.id) {
        this.mainService.update(this.id, {
          bookId: this.form.value.bookId!,
          customerId: this.form.value.customerId!,
          maxReturnDate: new Date(this.form.value.maxReturnDate!)
        }).subscribe({
          next: () => {
            this.informSuccessAfterSaving();
          },
          error: () => {
            this.informErrorOnSaving();
          }
        });
        return;
      }
      this.mainService.insert({
        bookId: this.form.value.bookId!,
        customerId: this.form.value.customerId!,
        maxReturnDate: new Date(this.form.value.maxReturnDate!)
      }).subscribe({
        next: () => {
          this.informSuccessAfterSaving();
          this.location.back();
        },
        error: () => {
          this.informErrorOnSaving();
        }
      });
    }
  }

  private informSuccessAfterSaving() {
    this.toast.success('The book rental was saved successfully!');
  }

  private informErrorOnSaving() {
    this.toast.error(`Ops! I'm having some problems saving the book rental.`, null, 5000);
  }

  getMainData(id: number) {
    this.mainService.getById(id).subscribe(data => {
      const maxReturnDate = moment(new Date(data.maxReturnDate!)).utc().format('YYYY-MM-DD');
      this.form.patchValue({
        bookId: data.bookId,
        customerId: data.customerId,
        maxReturnDate: maxReturnDate
      });
      this.getCustomer(data.customerId);
      this.getBook(data.bookId);
      if (data.returnDate) {
        this.form.disable();
      }
    });
  }

  getCustomer(customerId?: number|null) {
    this.selectedBook = null;
    if (!customerId) return;
    this.customersService.getById(customerId).subscribe(data => {
      if (!data.name) return;
      this.selectedCustomer = {
        id: data.id,
        name: data.name,
        deletionDate: data.deletionDate
      };
    });
  }

  getBook(bookId?: number|null) {
    this.selectedBook = null;
    if (!bookId) return;
    this.booksService.getById(bookId).subscribe(data => {
      if (!data.title) return;
      this.selectedBook = {
        id: data.id,
        title: data.title,
        maxRentalDays: data.maxRentalDays ?? 0,
        quantity: data.quantity ?? 0,
        deletionDate: data.deletionDate,
        numberOfRentals: data.numberOfRentals,
        numberOfReturns: data.numberOfReturns
      };
    });
  }

  hideModals() {
    this.searchCustomersModalVisible = false;
    this.searchBooksModalVisible = false;
  }

  searchCustomers() {
    this.searchCustomersModalVisible = true;
  }

  selectCustomer(customer: Customer) {
    this.hideModals();
    this.selectedCustomer = customer;
    this.form.patchValue({
      customerId: customer.id
    });
  }

  searchBooks() {
    this.searchBooksModalVisible = true;
  }

  selectBook(book: Book) {
    this.hideModals();
    this.selectedBook = book;
    this.form.patchValue({
      bookId: book.id,
      maxReturnDate: moment(new Date()).add(book.maxRentalDays, 'days').format('YYYY-MM-DD')
    });
  }
}
