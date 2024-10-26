import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegAsistenciaPage } from './reg-asistencia.page';

describe('RegAsistenciaPage', () => {
  let component: RegAsistenciaPage;
  let fixture: ComponentFixture<RegAsistenciaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegAsistenciaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
