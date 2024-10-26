import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModCarreraPage } from './mod-carrera.page';

describe('ModCarreraPage', () => {
  let component: ModCarreraPage;
  let fixture: ComponentFixture<ModCarreraPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ModCarreraPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
