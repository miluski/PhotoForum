import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UnauthorizedComponent } from './unauthorized.component';
import { FilterService } from '../../services/filter.service';

describe('UnauthorizedComponent', () => {
  let component: UnauthorizedComponent;
  let fixture: ComponentFixture<UnauthorizedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        UnauthorizedComponent,
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        {
          provide: FilterService,
          useValue: {
            applyFilter: jasmine.createSpy('applyFilter')
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnauthorizedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});