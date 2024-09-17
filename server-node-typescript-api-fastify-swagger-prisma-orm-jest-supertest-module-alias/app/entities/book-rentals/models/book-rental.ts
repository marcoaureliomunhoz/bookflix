import { Book } from '@entities/books/models/book';
import { Customer } from '@entities/customers/models/customer';

export type BookRentalProps = {
  id: number;
  creationDate: Date;
  maxReturnDate: Date;
  returnDate?: Date | null;
  customerId: number;
  customer?: Customer | null;
  bookId: number;
  book?: Book | null;
};

export class BookRental {
  private _bookRentalId!: number;
  private _creationDate!: Date;
  private _maxReturnDate!: Date;
  private _returnDate?: Date | null;
  private _customerId!: number;
  private _customer?: Customer | null;
  private _bookId!: number;
  private _book?: Book | null;

  private constructor(
    maxReturnDate: Date,
    customerId: number,
    bookId: number,
    id?: number | null,
    returnDate?: Date | null,
    creationDate?: Date | null,
    customer?: Customer | null,
    book?: Book | null
  ) {
    if (id) this._bookRentalId = id;

    this._maxReturnDate = maxReturnDate;
    this._customerId = customerId;
    this._bookId = bookId;
    this._creationDate = creationDate || new Date();
    this._book = book;
    this._customer = customer;
    this._returnDate = returnDate;

    this.validate();
  }

  public static create(maxReturnDate: Date, customerId: number, bookId: number) {
    return new BookRental(maxReturnDate, customerId, bookId);
  }
  public static createFromProps(props: BookRentalProps) {
    const bookRetail = new BookRental(props.maxReturnDate, props.customerId, props.bookId, props.id, props.returnDate, props.creationDate, props.customer, props.book);
    return bookRetail;
  }

  private validate() {}

  public get id() {
    return this._bookRentalId;
  }
  public get maxReturnDate() {
    return this._maxReturnDate;
  }
  public get returnDate() {
    return this._returnDate;
  }
  public get creationDate() {
    return this._creationDate;
  }
  public get customerId() {
    return this._customerId;
  }
  public get customer() {
    return this._customer;
  }
  public get bookId() {
    return this._bookId;
  }
  public get book() {
    return this._book;
  }

  public update(maxReturnDate: Date, customerId: number, bookId: number) {
    this._maxReturnDate = maxReturnDate;
    this._customerId = customerId;
    this._bookId = bookId;

    this.validate();
  }

  public return() {
    this._returnDate = new Date();

    this.validate();
  }
}
