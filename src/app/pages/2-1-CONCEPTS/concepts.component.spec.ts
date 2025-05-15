import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CONCEPTSComponent } from './concepts.component';

describe('CONCEPTSComponent', () => {
  let component: CONCEPTSComponent;
  let fixture: ComponentFixture<CONCEPTSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CONCEPTSComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CONCEPTSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
