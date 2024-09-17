import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RegisterComponent } from "./register.component";
import { CustomersService, GetByIdOutput } from "../customers.service";
import { of } from "rxjs";

const getByIdOutputWithCustomer1: GetByIdOutput = {
  id: 1,
  name: 'test',
  deletionDate: null
};

describe('Customer RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let customersService: jasmine.SpyObj<CustomersService>;

  beforeEach(async () => {
    customersService = jasmine.createSpyObj('CustomersService', ['getById', 'insert', 'update']);
    customersService.getById.withArgs(1).and.returnValue(of(getByIdOutputWithCustomer1));

    await TestBed.configureTestingModule({
      imports: [ RegisterComponent ],
      providers: [
        { provide: CustomersService, useValue: customersService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', async () => {
    expect(component).toBeTruthy();
  });

  it('if id is not defined, the title should contain the word add', () => {
    expect(component.title.toLowerCase()).toContain('add');
  });

  it('should consider the form as invalid if the name is empty', () => {
    expect(component.form.valid).toBeFalse();
  });

  it('should consider the form as invalid if the name contains 1 character', () => {
    component.form.patchValue({
      name: 'a'
    });
    fixture.detectChanges();
    expect(component.form.valid).toBeFalse();
  });

  it('should consider the form as invalid if the name contains 2 characters', () => {
    component.form.patchValue({
      name: 'ab'
    });
    fixture.detectChanges();
    expect(component.form.valid).toBeFalse();
  });

  it('should consider the form as valid if the name contains 3 characters', () => {
    component.form.patchValue({
      name: 'abc'
    });
    fixture.detectChanges();
    expect(component.form.valid).toBeTrue();
  });

  it('should consider the form as valid if the name contains 3 or more characters', () => {
    component.form.patchValue({
      name: 'abc'.padEnd(Math.floor(Math.random()*100), 'x')
    });
    fixture.detectChanges();
    console.log('name:', component.form.value.name);
    console.log('length:', component.form.value.name?.length);
    expect(component.form.valid).toBeTrue();
  });

  it('should update the form if id is greater than zero', () => {
    component.getMainData(getByIdOutputWithCustomer1.id!);
    fixture.detectChanges();
    expect(component.form.value.name).toEqual(getByIdOutputWithCustomer1.name);
  });

  it('should call insert if the id is not defined', () => {
    component.id = null;
    fixture.detectChanges();
    component.clickHeaderButton(component.buttons.Save);
    expect(customersService.insert.calls.count()).toBe(1);
    expect(customersService.update.calls.count()).toBe(0);
  });

  it('should call update if the id is defined', () => {
    component.id = 2;
    fixture.detectChanges();
    component.clickHeaderButton(component.buttons.Save);
    expect(customersService.insert.calls.count()).toBe(0);
    expect(customersService.update.calls.count()).toBe(1);
  });

});
