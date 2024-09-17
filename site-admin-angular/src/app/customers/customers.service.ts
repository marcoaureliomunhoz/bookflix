import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Pagination } from '../_common/models/Pagination';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  private SERVICE_ADDREES = `${environment.httpServerUrl}/customers`;

  constructor(private readonly http: HttpClient) { }

  public list(includes?: number[]|null, page?: number|null, pageSize?: number|null): Observable<ListOutput> {
    let query = '';
    if (includes) {
      query += (query ? '&' : '') + `includes=${includes.join(',')}`;
    }
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

  public update(id: number, name: string) : Observable<UpdateOutput> {
    return this.http.put(`${this.SERVICE_ADDREES}/${id}`, {
      name
    }) as Observable<UpdateOutput>;
  }

  public insert(name: string) : Observable<InsertOutput> {
    return this.http.post(`${this.SERVICE_ADDREES}`, {
      name
    }) as Observable<InsertOutput>;
  }

  public delete(id: number) : Observable<DeleteOutput> {
    return this.http.delete(`${this.SERVICE_ADDREES}/${id}`) as Observable<DeleteOutput>;
  }
}

export type ListOutput = {
  list: {
    id: number;
    name: string;
    deletionDate?: Date | null;
  }[];
  pagination: Pagination;
};

export type GetByIdOutput = {
  id?: number | null;
  name?: string | null;
  deletionDate?: Date | null;
};

export interface UpdateOutput {
  id?: number | null;
  name?: string | null;
}

export interface InsertOutput {
  id?: number | null;
  name?: string | null;
}

export type DeleteOutput = {
  id?: number | null;
  name?: string | null;
  deletionDate?: Date | null;
};
