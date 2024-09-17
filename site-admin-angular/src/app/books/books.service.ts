import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Pagination } from '../_common/models/Pagination';

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  private SERVICE_ADDREES = `${environment.httpServerUrl}/books`;

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

  public delete(id: number) : Observable<DeleteOutput> {
    return this.http.delete(`${this.SERVICE_ADDREES}/${id}`) as Observable<DeleteOutput>;
  }
}

export type UpdateInput = {
  title: string;
  quantity: number;
  maxRentalDays: number;
  publisherId?: number | null;
}

export type InsertInput = {
  title: string;
  quantity: number;
  maxRentalDays: number;
  publisherId?: number | null;
}

export type ListOutput = {
  list: {
    id: number;
    title: string;
    deletionDate?: Date | null;
    quantity: number;
    maxRentalDays: number;
    publisherId?: number | null;
    numberOfRentals: number;
    numberOfReturns: number;
  }[];
  pagination: Pagination;
};

export type GetByIdOutput = {
  id?: number | null;
  title?: string | null;
  deletionDate?: Date | null;
  quantity?: number | null;
  maxRentalDays?: number | null;
  publisherId?: number | null;
  numberOfRentals: number;
  numberOfReturns: number;
};

export interface UpdateOutput {
  id?: number | null;
  title?: string | null;
  quantity?: number | null;
  maxRentalDays?: number | null;
  publisherId?: number | null;
  numberOfRentals: number;
  numberOfReturns: number;
}

export interface InsertOutput {
  id?: number | null;
  title?: string | null;
  quantity?: number | null;
  maxRentalDays?: number | null;
  publisherId?: number | null;
  numberOfRentals: number;
  numberOfReturns: number;
}

export type DeleteOutput = {
  id?: number | null;
  name?: string | null;
  deletionDate?: Date | null;
  quantity?: number | null;
  maxRentalDays?: number | null;
  publisherId?: number | null;
  numberOfRentals: number;
  numberOfReturns: number;
};
