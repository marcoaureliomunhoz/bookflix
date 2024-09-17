import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class Alert {
  public static create(): Alert {
    return new Alert();
  }

  private constructor() {}

  public error(title?: string, text?: string) {
    Swal.fire({
      title: title,
      text: text,
      icon: 'error',
      confirmButtonText: 'Ok'
    });
  }

  public info(title?: string, text?: string) {
    Swal.fire({
      title: title,
      text: text,
      icon: 'info',
      confirmButtonText: 'Ok'
    });
  }

  public success(title?: string, text?: string) {
    Swal.fire({
      title: title,
      text: text,
      icon: 'success',
      confirmButtonText: 'Ok'
    });
  }

  public warning(title?: string, text?: string) {
    Swal.fire({
      title: title,
      text: text,
      icon: 'warning',
      confirmButtonText: 'Ok'
    });
  }

  public confirm(title?: string, text?: string) {
    return Swal.fire({
      title: title,
      text: text,
      icon: 'question',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      showCancelButton: true
    });
  }
}
