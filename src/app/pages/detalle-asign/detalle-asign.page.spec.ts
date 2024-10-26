import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalleAsignPage } from './detalle-asign.page';

describe('DetalleAsignPage', () => {
  let component: DetalleAsignPage;
  let fixture: ComponentFixture<DetalleAsignPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleAsignPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
