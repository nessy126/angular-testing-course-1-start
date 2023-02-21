import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { COURSES, findLessonsForCourse } from '../../../../server/db-data';
import { Course } from '../model/course';
import { CoursesService } from './courses.service';

describe('CourseService', () => {

  let coursesService: CoursesService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CoursesService,
      ],
    });

    coursesService = TestBed.get(CoursesService);
    httpTestingController = TestBed.get(HttpTestingController);

  });
  it('should retrieve all courses', (done) => {
    coursesService.findAllCourses()
      .subscribe(courses => {
        expect(courses).toBeTruthy('No courses returted');
        expect(courses.length).toBe(12, 'incorrect number of courses');

        const course = courses.find(course => course.id == 12);
        expect(course.titles.description).toBe('Angular Testing Course');
        done();
      });

    const req = httpTestingController.expectOne('/api/courses');
    expect(req.request.method).toEqual('GET');

    req.flush({ payload: Object.values(COURSES) });
  });

  it('should find course by id', (done) => {
    const courseId = 12;
    coursesService.findCourseById(courseId)
      .subscribe(course => {
        expect(course).toBeTruthy('No one courses finded');
        expect(course.id).toBe(courseId);
        done();
      });

    const req = httpTestingController.expectOne('/api/courses/' + courseId);
    expect(req.request.method).toEqual('GET');

    req.flush(COURSES[courseId]);
  });

  it('should save the course data', (done) => {
    const courseId = 12;
    const changes: Partial<Course> = { titles: { description: 'Testing Course' } };
    coursesService.saveCourse(courseId, changes)
      .subscribe(
        course => {
          expect(course.id).toBe(courseId);
          done();
        },
      );

    const req = httpTestingController.expectOne('/api/courses/' + courseId);
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body.titles.description).toEqual(changes.titles.description);
    req.flush({
      ...COURSES[courseId],
      ...changes,
    });
  });

  it('should give an error if save course fails', (done) => {
    const courseId = 12;
    const changes: Partial<Course> = { titles: { description: 'Testing Course' } };
    coursesService.saveCourse(courseId, changes)
      .subscribe(
        () => fail('the save course operation should have failed'),
        (error: HttpErrorResponse) => {
          expect(error.status).toBe(500);
          done()
        },
      );

    const req = httpTestingController.expectOne('/api/courses/' + courseId);
    expect(req.request.method).toEqual('PUT');
    req.flush('Save course failed', { status: 500, statusText: 'Internal Server Error' });

  });

  it('should find a list of lessons', (done) => {
    coursesService.findLessons(12)
      .subscribe( lessons => {
        expect(lessons).toBeTruthy()
        expect(lessons.length).toBe(3)
        done()
      })

    const req = httpTestingController.expectOne(
      req => req.url == '/api/lessons'
    )

    expect(req.request.method).toEqual('GET')
    expect(req.request.params.get('courseId')).toEqual('12')
    expect(req.request.params.get('filter')).toEqual('')
    expect(req.request.params.get('sortOrder')).toEqual('asc')
    expect(req.request.params.get('pageNumber')).toEqual('0')
    expect(req.request.params.get('pageSize')).toEqual('3')

    req.flush({
      payload: findLessonsForCourse(12).slice(0,3)
    })

  })

  afterEach(() => {
    httpTestingController.verify();
  });
});
