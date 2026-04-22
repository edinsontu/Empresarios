import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterEmprendedorComponent } from './emprendedor.component';

describe('RegisterEmprendedorComponent', () => {
  let component: RegisterEmprendedorComponent;
  let fixture: ComponentFixture<RegisterEmprendedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterEmprendedorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterEmprendedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
