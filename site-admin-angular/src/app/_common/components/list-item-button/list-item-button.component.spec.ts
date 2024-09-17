import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListItemButtonComponent } from './list-item-button.component';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { provideRouter } from '@angular/router';

describe('ListItemButtonComponent', () => {
  let component: ListItemButtonComponent;
  let fixture: ComponentFixture<ListItemButtonComponent>;
  let element: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListItemButtonComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListItemButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    element = fixture.debugElement.query(By.css('.list-item-button'));
  });

  it('should create a button', () => {
    console.log('element name:', element.name);

    expect(component).toBeTruthy();
    expect(element.name.toLowerCase()).toEqual('button');
  });

  it('should create a link', () => {
    component.type = 'link';
    component.link = [''];
    fixture.detectChanges();
    element = fixture.debugElement.query(By.css('.list-item-button'));
    console.log('element name:', element.name);

    expect(element.name.toLowerCase()).toEqual('a');
  });

  it('should emit click', () => {
    let clicked = false;
    component.type = 'button';
    component.onClick.subscribe(() => clicked = true);
    fixture.detectChanges();
    element = fixture.debugElement.query(By.css('.list-item-button'));

    element.triggerEventHandler('click', null);

    expect(clicked).toBeTrue();
  });
});
