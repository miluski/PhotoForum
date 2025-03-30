import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderPopupComponent } from './header-popup.component';

describe('HeaderPopupComponent', () => {
  let component: HeaderPopupComponent;
  let fixture: ComponentFixture<HeaderPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
