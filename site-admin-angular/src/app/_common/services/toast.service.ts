import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

const defaultTimerValue = 4000;

@Injectable({
  providedIn: 'root'
})
export class Toast {
  private readonly toast?: typeof Swal;

  public static create(): Toast {
    return new Toast();
  }

  private constructor() {
    this.toast = Swal.mixin({
      toast: true,
      position: 'bottom',
      showConfirmButton: false,
      timer: defaultTimerValue,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
  }

  public error(title?: string|null, text?: string|null, timer?: number|null) {
    this.toast?.fire({
      title: title ?? undefined,
      text: text ?? undefined,
      icon: 'error',
      timer: timer ?? defaultTimerValue
    });
  }

  public info(title?: string|null, text?: string|null, timer?: number|null) {
    this.toast?.fire({
      title: title ?? undefined,
      text: text ?? undefined,
      icon: 'info',
      timer: timer ?? defaultTimerValue
    });
  }

  public success(title?: string|null, text?: string|null, timer?: number|null) {
    this.toast?.fire({
      title: title ?? undefined,
      text: text ?? undefined,
      icon: 'success',
      timer: timer ?? defaultTimerValue
    });
  }

  public warning(title?: string|null, text?: string|null, timer?: number|null) {
    this.toast?.fire({
      title: title ?? undefined,
      text: text ?? undefined,
      icon: 'warning',
      timer: timer ?? defaultTimerValue
    });
  }
}
