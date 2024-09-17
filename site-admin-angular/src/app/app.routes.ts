import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { publishersRoutes } from './publishers/publishers.routes';
import { booksRoutes } from './books/books.routes';
import { customersRoutes } from './customers/customers.routes';
import { bookRentalsRoutes } from './book-rentals/book-rentals.routes';

export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'publishers',
    children: publishersRoutes
  },
  {
    path: 'books',
    children: booksRoutes
  },
  {
    path: 'customers',
    children: customersRoutes
  },
  {
    path: 'book-rentals',
    children: bookRentalsRoutes
  },
  {
    path: '**',
    component: HomeComponent
  }
];
