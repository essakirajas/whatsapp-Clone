import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoneNoComponent } from './phone-no.component';

describe('PhoneNoComponent', () => {
  let component: PhoneNoComponent;
  let fixture: ComponentFixture<PhoneNoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhoneNoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhoneNoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
