export class Book {
  id?: number | null;
  title!: string;
  deletionDate?: Date | null;
  quantity!: number;
  maxRentalDays!: number;
  numberOfRentals!: number;
  numberOfReturns!: number;
}
