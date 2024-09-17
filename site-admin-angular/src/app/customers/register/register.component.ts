import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { PageHeaderComponent } from '../../_common/components/page-header/page-header.component';
import { PageBodyComponent } from '../../_common/components/page-body/page-body.component';
import { PageFooterComponent } from '../../_common/components/page-footer/page-footer.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomersService } from '../customers.service';
import { InputGroupComponent } from '../../_common/components/input-group/input-group.component';
import { Toast } from '../../_common/services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    PageHeaderComponent, PageBodyComponent, PageFooterComponent,
    InputGroupComponent
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {

  @Input() id?: number|null = null;

  title: string = 'Register Customer';
  buttons = {
    Save: 'save'
  };
  form = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(3)]]
  });

  constructor(private location: Location, private formBuilder: FormBuilder, private mainService: CustomersService, private toast: Toast) {}

  ngOnInit() {
    if (this.id) {
      this.title = 'Edit Customer';
      this.getMainData(this.id);
    } else {
      this.title = 'Add Customer';
    }
  }

  clickHeaderButton(buttonName: string) {
    if (buttonName === this.buttons.Save) {
      try {
        if (this.id) {
          this.mainService.update(this.id, this.form.value.name ?? '').subscribe({
            next: () => {
              this.informSuccessAfterSaving();
            },
            error: () => {
              this.informErrorOnSaving();
            }
          });
          return;
        }
        this.mainService.insert(this.form.value.name ?? '').subscribe({
          next: () => {
            this.informSuccessAfterSaving();
            this.location.back();
          },
          error: () => {
            this.informErrorOnSaving();
          }
      });
      } catch (error) {
        this.informErrorOnSaving();
      }
    }
  }

  private informSuccessAfterSaving() {
    this.toast.success('The customer was saved successfully!');
  }

  private informErrorOnSaving() {
    this.toast.error(`Ops! I'm having some problems saving the customer.`, null, 5000);
  }

  getMainData(id: number) {
    this.mainService.getById(id).subscribe(data => {
      this.form.patchValue({
        name: data.name
      });
    });
  }
}
