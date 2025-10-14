import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApicuronConsentComponent } from './apicuron-consent.component';

describe('ApicuronConsentComponent', () => {
  let component: ApicuronConsentComponent;
  let fixture: ComponentFixture<ApicuronConsentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApicuronConsentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApicuronConsentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
