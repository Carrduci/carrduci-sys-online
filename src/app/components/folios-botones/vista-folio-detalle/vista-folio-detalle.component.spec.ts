import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaFolioDetalleComponent } from './vista-folio-detalle.component';

describe('VistaFolioDetalleComponent', () => {
  let component: VistaFolioDetalleComponent;
  let fixture: ComponentFixture<VistaFolioDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VistaFolioDetalleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VistaFolioDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
