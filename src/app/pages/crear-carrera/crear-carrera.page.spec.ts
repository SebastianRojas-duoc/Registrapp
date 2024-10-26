import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrearCarreraPage } from './crear-carrera.page';

describe('CrearCarreraPage', () => {
  let component: CrearCarreraPage;
  let fixture: ComponentFixture<CrearCarreraPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearCarreraPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
