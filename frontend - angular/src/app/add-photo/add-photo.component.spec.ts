import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AddPhotoComponent } from './add-photo.component';
import { PhotoService } from '../../services/photo.service';

describe('AddPhotoComponent', () => {
  let component: AddPhotoComponent;
  let fixture: ComponentFixture<AddPhotoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AddPhotoComponent,
        RouterTestingModule,
        HttpClientTestingModule,
        NoopAnimationsModule
      ],
      providers: [
        {
          provide: PhotoService,
          useValue: {
            addPhoto: jasmine.createSpy('addPhoto')
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPhotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  }); 
});