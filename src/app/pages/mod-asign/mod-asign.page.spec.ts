import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModAsignPage } from './mod-asign.page';

describe('ModAsignPage', () => {
  let component: ModAsignPage;
  let fixture: ComponentFixture<ModAsignPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ModAsignPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
