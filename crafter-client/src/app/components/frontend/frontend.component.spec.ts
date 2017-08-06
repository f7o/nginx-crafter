import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontendComponent } from './frontend.component';

describe('FrontendComponent', () => {
  let component: FrontendComponent;
  let fixture: ComponentFixture<FrontendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrontendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrontendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
