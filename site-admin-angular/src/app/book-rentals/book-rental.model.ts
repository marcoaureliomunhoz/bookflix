export class BookRental {
  id?: number;
  creationDate!: Date;
  maxReturnDate!: Date;
  returnDate?: Date | null;
  customerId!: number;
  bookId!: number;
}

export class BookRentalForList extends BookRental {
  customerName?: string | null;
  bookTitle?: string | null;
  formattedMaxReturnDate!: string | null;
  formattedReturnDate!: string | null;
}
