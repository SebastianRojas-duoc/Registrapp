import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IniAsistenciaPage } from './ini-asistencia.page';

describe('IniAsistenciaPage', () => {
  let component: IniAsistenciaPage;
  let fixture: ComponentFixture<IniAsistenciaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(IniAsistenciaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
