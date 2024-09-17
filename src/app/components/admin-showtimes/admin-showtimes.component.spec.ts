import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AdminShowtimesComponent} from './admin-showtimes.component';

describe('AdminShowtimesComponent', () => {
  let component: AdminShowtimesComponent;
  let fixture: ComponentFixture<AdminShowtimesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminShowtimesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminShowtimesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
