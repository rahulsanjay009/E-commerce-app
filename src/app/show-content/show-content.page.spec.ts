import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ShowContentPage } from './show-content.page';

describe('ShowContentPage', () => {
  let component: ShowContentPage;
  let fixture: ComponentFixture<ShowContentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowContentPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ShowContentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
