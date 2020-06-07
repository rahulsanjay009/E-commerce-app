import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OurstoryComponent } from './ourstory.component';

describe('OurstoryComponent', () => {
  let component: OurstoryComponent;
  let fixture: ComponentFixture<OurstoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OurstoryComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OurstoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
