import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AsignPage } from './asign.page';

describe('AsignPage', () => {
  let component: AsignPage;
  let fixture: ComponentFixture<AsignPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
