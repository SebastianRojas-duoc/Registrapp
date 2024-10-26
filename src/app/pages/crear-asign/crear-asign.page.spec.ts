import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrearAsignPage } from './crear-asign.page';

describe('CrearAsignPage', () => {
  let component: CrearAsignPage;
  let fixture: ComponentFixture<CrearAsignPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearAsignPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
