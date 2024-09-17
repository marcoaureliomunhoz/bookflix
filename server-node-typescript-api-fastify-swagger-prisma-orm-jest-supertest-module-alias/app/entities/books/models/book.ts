import { Publisher } from '@entities/publishers/models/publisher';

export type BookProps = {
  id: number;
  title: string;
  deletionDate?: Date | null;
  quantity: number;
  maxRentalDays: number;
  publisherId?: number | null;
  publisher?: Publisher | null;
  numberOfRentals: number;
  numberOfReturns: number;
};

export class Book {
  private _bookId!: number;
  private _title!: string;
  private _deletionDate?: Date | null;
  private _quantity!: number;
  private _maxRentalDays!: number;
  private _publisherId?: number | null;
  private _publisher?: Publisher | null;
  private _numberOfRentals!: number;
  private _numberOfReturns!: number;

  private constructor(
    title: string,
    id?: number | null,
    deletionDate?: Date | null,
    quantity?: number | null,
    maxRentalDays?: number | null,
    publisherId?: number | null,
    publisher?: Publisher | null,
    numberOfRentals?: number | null,
    numberOfReturns?: number | null
  ) {
    this._title = title;

    if (id) this._bookId = id;
    this._deletionDate = deletionDate;

    this._quantity = quantity ?? 0;
    this._maxRentalDays = maxRentalDays ?? 0;

    this._publisherId = publisherId;
    this._publisher = publisher;

    this._numberOfRentals = numberOfRentals ?? 0;
    this._numberOfReturns = numberOfReturns ?? 0;

    this.validate();
  }

  public static create(title: string, quantity?: number | null, maxRentalDays?: number | null, publisherId?: number | null) {
    return new Book(title, null, null, quantity, maxRentalDays, publisherId);
  }
  public static createFromProps(props: BookProps) {
    return new Book(props.title, props.id, props.deletionDate, props.quantity, props.maxRentalDays, props.publisherId, props.publisher, props.numberOfRentals, props.numberOfReturns);
  }

  private validate() {
    if (!this._title || this._title.length < 3) {
      throw new Error('The title must be 3 or more characters.');
    }
  }

  public get id() {
    return this._bookId;
  }
  public get title() {
    return this._title;
  }
  public get deletionDate() {
    return this._deletionDate;
  }
  public get quantity() {
    return this._quantity;
  }
  public get maxRentalDays() {
    return this._maxRentalDays;
  }
  public get publisherId() {
    return this._publisherId;
  }
  public get numberOfRentals() {
    return this._numberOfRentals;
  }
  public get numberOfReturns() {
    return this._numberOfReturns;
  }

  public delete() {
    this._deletionDate = new Date();
  }

  public update(title: string, quantity?: number | null, maxRentalDays?: number | null, publisherId?: number | null) {
    this._title = title ?? '';
    this._publisherId = publisherId;
    this._quantity = quantity ?? 0;
    this._maxRentalDays = maxRentalDays ?? 0;
    if (this._publisher && this._publisher.id !== publisherId) {
      this._publisher = null;
    }

    this.validate();
  }

  public rent() {
    this._numberOfRentals += 1;

    this.validate();
  }

  public return() {
    this._numberOfReturns += 1;

    this.validate();
  }
}
