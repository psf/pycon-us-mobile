import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadNoteModalComponent } from './lead-note-modal.component';

describe('LeadNoteModalComponent', () => {
  let component: LeadNoteModalComponent;
  let fixture: ComponentFixture<LeadNoteModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeadNoteModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadNoteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
