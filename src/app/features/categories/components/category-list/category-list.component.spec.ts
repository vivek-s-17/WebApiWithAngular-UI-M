import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

// Needed for Angular Router services (like Router, ActivatedRoute, Location)
import { provideRouter } from '@angular/router';

import { CategoryListComponent } from './category-list.component';
import { CategoryService } from '../../services/category.service';
import { CategoryReadModel } from '../../models/category-read.model';


describe('CategoryListComponent', () => {

  let component: CategoryListComponent;
  let fixture: ComponentFixture<CategoryListComponent>;

  let categoryServiceMock: {
    getAll: ReturnType<typeof vi.fn>;
  };



  beforeEach(async () => {

    categoryServiceMock = {
      getAll: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [CategoryListComponent],
      providers: [
        provideRouter([]),
        {
          provide: CategoryService,
          useValue: categoryServiceMock
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryListComponent);
    component = fixture.componentInstance;
  });


  // ----- Test #1
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });


  // ----- Test #2
  it('should load categories on init', () => {

    const mockCategories: CategoryReadModel[] = [
      {
        categoryId: 1,
        name: 'Electronics',
        description: 'Devices',
        createdAtUtc: new Date().toISOString(),
        modifiedAtUtc: null,
        rowVersion: 'abc'
      }
    ];

    categoryServiceMock.getAll.mockReturnValue(of(mockCategories));

    fixture.detectChanges();

    expect(component.categories.length).toBe(1);
    expect(categoryServiceMock.getAll).toHaveBeenCalled();
  });


  // ----- Test #3
  it('should display categories in table', () => {

    const mockCategories: CategoryReadModel[] = [
      {
        categoryId: 1,
        name: 'Electronics',
        description: 'Devices',
        createdAtUtc: new Date().toISOString(),
        modifiedAtUtc: null,
        rowVersion: 'abc'
      }
    ];

    categoryServiceMock.getAll.mockReturnValue(of(mockCategories));

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    const rows = compiled.querySelectorAll('tbody tr');

    expect(rows.length).toBe(1);
    expect(rows[0].textContent).toContain('Electronics');
  });


  // ----- Test #4
  it('should display error message when API fails', () => {

    categoryServiceMock.getAll.mockReturnValue(
      throwError(() => ({ detail: 'API error occurred' }))
    );

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('API error occurred');
  });


});
