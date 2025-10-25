import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CeiSsoClientNg } from './cei-sso-client-ng';

describe('CeiSsoClientNg', () => {
  let component: CeiSsoClientNg;
  let fixture: ComponentFixture<CeiSsoClientNg>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CeiSsoClientNg]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CeiSsoClientNg);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
