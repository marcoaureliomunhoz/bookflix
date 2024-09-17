import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Pagination } from '../_common/models/Pagination';

@Injectable({
  providedIn: 'root'
})
export class BookRentalsService {

  private SERVICE_ADDREES = `${environment.httpServerUrl}/book-rentals`;

  constructor(private readonly http: HttpClient) { }

  public list(page?: number|null, pageSize?: number|null): Observable<ListOutput> {
    let query = '';
    if (page) {
      query += (query ? '&' : '') + `page=${page}`;
    }
    if (pageSize) {
      query += (query ? '&' : '') + `pageSize=${pageSize}`;
    }
    if (query) {
      query = `?${query}`;
    }
    return this.http.get(`${this.SERVICE_ADDREES}${query}`) as Observable<ListOutput>;
  }

  public getById(id: number): Observable<GetByIdOutput> {
    return this.http.get(`${this.SERVICE_ADDREES}/${id}`) as Observable<GetByIdOutput>;
  }

  public update(id: number, input: UpdateInput) : Observable<UpdateOutput> {
    return this.http.put(`${this.SERVICE_ADDREES}/${id}`, input) as Observable<UpdateOutput>;
  }

  public insert(input: InsertInput) : Observable<InsertOutput> {
    return this.http.post(`${this.SERVICE_ADDREES}`, input) as Observable<InsertOutput>;
  }

  public return(id: number) : Observable<ReturnOutput> {
    return this.http.put(`${this.SERVICE_ADDREES}/${id}/return`, null) as Observable<ReturnOutput>;
  }
}

export type UpdateInput = {
  maxReturnDate: Date;
  customerId: number;
  bookId: number;
}

export type InsertInput = {
  maxReturnDate: Date;
  customerId: number;
  bookId: number;
}

export type ListOutput = {
  list: {
    id: number;
    creationDate: Date;
    maxReturnDate: Date;
    returnDate?: Date | null;
    customerId: number;
    customerName?: string | null;
    bookId: number;
    bookTitle?: string | null;
  }[];
  pagination: Pagination;
};

export type GetByIdOutput = {
  id: number | null;
  creationDate: Date | null;
  maxReturnDate: Date | null;
  returnDate?: Date | null;
  customerId: number | null;
  bookId: number | null;
};

export interface UpdateOutput {
  id?: number | null;
  creationDate?: Date | null;
  maxReturnDate?: Date | null;
  returnDate?: Date | null;
  customerId?: number | null;
  bookId?: number | null;
}

export interface InsertOutput {
  id?: number | null;
  creationDate?: Date | null;
  maxReturnDate?: Date | null;
  returnDate?: Date | null;
  customerId?: number | null;
  bookId?: number | null;
}

export interface ReturnOutput {
  id?: number | null;
  creationDate?: Date | null;
  maxReturnDate?: Date | null;
  returnDate?: Date | null;
  customerId?: number | null;
  bookId?: number | null;
}
