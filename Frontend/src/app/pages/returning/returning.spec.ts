import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Returning } from './returning/returning';

describe('Returning', () => {
  let component: Returning;
  let fixture: ComponentFixture<Returning>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Returning]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Returning);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
