import { async, ComponentFixture, fakeAsync, flush, flushMicrotasks, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { CoursesCardListComponent } from '../courses-card-list/courses-card-list.component';
import { CoursesModule } from '../courses.module';
import { DebugElement, Testability } from '@angular/core';

import { HomeComponent } from './home.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CoursesService } from '../services/courses.service';
import { HttpClient } from '@angular/common/http';
import { COURSES } from '../../../../server/db-data';
import { setupCourses } from '../common/setup-test-data';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { click } from '../common/test-utils';

describe('HomeComponent', () => {

  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let el: DebugElement;
  let coursesService: any;

  const beginnerCourses = setupCourses()
    .filter(course => course.category == 'BEGINNER');

  const advancedCourses = setupCourses()
    .filter(course => course.category == 'ADVANCED');

  beforeEach(waitForAsync(() => {

    const CoursesServiceSpy = jasmine.createSpyObj('CoursesService', ['findAllCourses']);

    TestBed.configureTestingModule({
      imports: [CoursesModule, NoopAnimationsModule],
      providers: [{ provide: CoursesService, useValue: CoursesServiceSpy }],
    }).compileComponents() //return promise
      .then(() => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
        coursesService = TestBed.get(CoursesService); // .get alwais return type any?
      });
  }));

  it('should create the component', () => {

    expect(component).toBeTruthy();

  });

  it('should display only beginner courses', () => {

    coursesService.findAllCourses.and.returnValue(of(beginnerCourses));
    fixture.detectChanges();

    const tabs = el.queryAll(By.css('.mat-mdc-tab'));
    expect(tabs.length).toBe(1, 'Unexpected number of tabs found');

  });

  it('should display only advanced courses', () => {
    coursesService.findAllCourses.and.returnValue(of(advancedCourses));
    fixture.detectChanges();

    const tabs = el.queryAll(By.css('.mat-mdc-tab'));
    expect(tabs.length).toBe(1, 'Unexpected number of tabs found');
  });

  it('should display both tabs', () => {

    coursesService.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();

    const tabs = el.queryAll(By.css('.mat-mdc-tab'));
    expect(tabs.length).toBe(2, 'Unexpected number of tabs found');

  });

  it('should display advanced courses when tab clicked', fakeAsync(() => {
// используется для того, чтобы можно было писать асинхронны   код в синхронной манере
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();
    const tabs = el.queryAll(By.css('.mat-mdc-tab'));

    click(tabs[1]);
    // el.nativeElement.click(tabs[1]);
    fixture.detectChanges();
    flush()
    // flushMicrotasks()//doesn;t work
    // tick(16)
    const cardTitles = el.queryAll(By.css('.mat-mdc-card-title'));
    expect(cardTitles.length).toBeGreaterThan(0, 'Could not find card title');

    const activeTab = el.queryAll(By.css('.mat-mdc-tab-body-active .mat-mdc-card-title'))
    expect(activeTab).toBeTruthy()
    expect(activeTab[0].nativeElement.textContent).toContain('Angular Security Course');

  }));

  it('should display advanced courses when tab clicked - waitForAsync', waitForAsync(() => {
//waitForAsync позволяет осузествлять внутри него http requets, в отличие от fakeAsync
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();
    const tabs = el.queryAll(By.css('.mat-mdc-tab'));

    click(tabs[1]);
    // el.nativeElement.click(tabs[1]);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      console.log('whenStable()')
       const cardTitles = el.queryAll(By.css('.mat-mdc-card-title'));
      expect(cardTitles.length).toBeGreaterThan(0, 'Could not find card title');

      const activeTab = el.queryAll(By.css('.mat-mdc-tab-body-active .mat-mdc-card-title'));
      expect(activeTab).toBeTruthy();
      expect(activeTab[0].nativeElement.textContent).toContain('Angular Security Course');

    })

  }));

});


