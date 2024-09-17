import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { PageHeaderComponent } from '../../_common/components/page-header/page-header.component';
import { PageBodyComponent } from '../../_common/components/page-body/page-body.component';
import { PageFooterComponent } from '../../_common/components/page-footer/page-footer.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BooksService } from '../books.service';
import { InputGroupComponent } from '../../_common/components/input-group/input-group.component';
import { Publisher } from '../../publishers/publisher.model';
import { PublishersService } from '../../publishers/publishers.service';
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

  title: string = 'Register Book';
  buttons = {
    Save: 'save'
  };
  form = this.formBuilder.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    quantity: [0, [Validators.required, Validators.min(0)]],
    maxRentalDays: [0, [Validators.required, Validators.min(0)]],
    publisherId: [0, [Validators.required, Validators.min(1)]]
  });
  publishers: Publisher[] = [];
  loadingPublishers: boolean = true;

  constructor(
    private location: Location, private formBuilder: FormBuilder,
    private mainService: BooksService, private publishersService: PublishersService,
    private toast: Toast
  ) {}

  ngOnInit() {
    if (this.id) {
      this.title = 'Edit Book';
      this.getMainData(this.id);
    } else {
      this.title = 'Add Book';
      this.getPublishers();
    }
  }

  clickHeaderButton(buttonName: string) {
    console.log(this.form.value)
    if (buttonName === this.buttons.Save) {
      try {
        if (this.id) {
          this.mainService.update(this.id, {
            title: this.form.value.title ?? '',
            quantity: this.form.value.quantity ?? 0,
            maxRentalDays: this.form.value.maxRentalDays ?? 0,
            publisherId: this.form.value.publisherId ? Number(this.form.value.publisherId) : null
          }).subscribe({
            next: () => {
              this.informSuccessAfterSaving();
            },
            error: () => {
              this.informErrorOnSaving();
            }
          });
          return;
        }
        this.mainService.insert({
          title: this.form.value.title ?? '',
          quantity: this.form.value.quantity ?? 0,
          maxRentalDays: this.form.value.maxRentalDays ?? 0,
          publisherId: this.form.value.publisherId ? Number(this.form.value.publisherId) : null
        }).subscribe({
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
    this.toast.success('The book was saved successfully!');
  }

  private informErrorOnSaving() {
    this.toast.error(`Ops! I'm having some problems saving the book.`, null, 5000);
  }

  getPublishers(includes?: number[]|null) {
    this.publishersService.list(includes).subscribe(data => {
      this.publishers = data.list || [];
      this.loadingPublishers = false;
    });
  }

  getMainData(id: number) {
    this.mainService.getById(id).subscribe(data => {
      this.form.patchValue({
        title: data.title,
        quantity: data.quantity,
        maxRentalDays: data.maxRentalDays,
        publisherId: data.publisherId
      });
      this.getPublishers(data.publisherId ? [ data.publisherId ] : null);
    });
  }
}
