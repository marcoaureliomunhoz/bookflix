import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
import { By } from "@angular/platform-browser";
import { of } from "rxjs";
//import { HttpClient } from "@angular/common/http";
import { ListComponent } from "./list.component";
import { CustomersService, ListOutput } from "../customers.service";

const initialOutputList: ListOutput = {
  list: [{
    id: 1,
    name: 'customer 1',
    deletionDate: null
  }],
  pagination: {
    listSize: 1,
    page: 1,
    pageSize: 5,
    numberOfPages: 1
  }
};
const initialContentLit = initialOutputList.list.map(item => item.name);

describe('Customer ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  //let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let customersService: jasmine.SpyObj<CustomersService>;

  beforeEach(async () => {
    //httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post']);
    //httpClientSpy.get.and.returnValue(of({ status: 200, data: {} }));

    customersService = jasmine.createSpyObj('CustomersService', ['list']);
    customersService.list.and.returnValue(of(initialOutputList));

    await TestBed.configureTestingModule({
      imports: [ListComponent],
      providers: [
        provideRouter([]),
        //{provide: HttpClient, useValue: httpClientSpy },
        //CustomersService
        { provide: CustomersService, useValue: customersService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', async () => {
    expect(component).toBeTruthy();
  });

  it('should populate mainList with the expected initial output list', async () => {
    await fixture.whenStable();
    expect(component.mainList).toEqual(initialOutputList.list);
  });

  it('should display the initial content list', async () => {
    const elements = fixture.debugElement.queryAll(By.css('app-list-item'));
    console.log('elements', elements.length);
    const contents = elements.map(e => e.query(By.css("[role=content]"))?.nativeElement?.textContent?.trim());
    console.log('contents', contents);
    expect(elements.length).toEqual(initialOutputList.list.length);
    expect(contents).toEqual(initialContentLit);
  });
});
