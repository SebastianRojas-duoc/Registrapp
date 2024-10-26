import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalleUsuarioPage } from './mod-usuario.page';

describe('DetalleUsuarioPage', () => {
  let component: DetalleUsuarioPage;
  let fixture: ComponentFixture<DetalleUsuarioPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleUsuarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
