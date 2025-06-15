import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HeaderPopupComponent } from './header-popup.component';
import { AuthService } from '../../services/auth.service';

describe('HeaderPopupComponent', () => {
  let component: HeaderPopupComponent;
  let fixture: ComponentFixture<HeaderPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HeaderPopupComponent,
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        {
          provide: AuthService,
          useValue: {
            isAuthorizedUser: false
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderPopupComponent);
    component = fixture.componentInstance;
    component.isOpened = false; 
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});