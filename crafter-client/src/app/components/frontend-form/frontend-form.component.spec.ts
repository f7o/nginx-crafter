import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontendFormComponent } from './frontend-form.component';

describe('FrontendFormComponent', () => {
  let component: FrontendFormComponent;
  let fixture: ComponentFixture<FrontendFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrontendFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrontendFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
