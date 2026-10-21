import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class Errors {

  constructor(
    private toastr: ToastrService
  ) {}

  messageError (e: HttpErrorResponse) {
    if (e.error.msg) {
      console.log('Error message:', e.error.msg);
      this.toastr.warning(e.error.msg, 'Error');
    }
    else{
    this.toastr.error('Error al registrar el usuario en la API', 'Error');
    }

  }
}
