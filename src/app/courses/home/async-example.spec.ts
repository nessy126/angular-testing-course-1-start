import { fakeAsync, flush, flushMicrotasks, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

describe('Async Testing Examples', () => {
  it('Asynchronous tes with Jasmine done()', (done: DoneFn) => {
    let test = false;

    setTimeout(() => {
      console.log('running assertions test');
      test = true;
      expect(test).toEqual(true, 'test not equal true');
      done();
    }, 1000);
  });

  it('Asynchronous tes with SetTimeOut()', fakeAsync(() => {

    let test = false;
    setTimeout(() => {
    });
    setTimeout(() => {
      console.log('running assertions test SetTimeOut()');
      test = true;
      expect(test).toEqual(true, 'test not equal true');
    }, 1000);

    // tick(1000)
    flush();
    expect(test).toBeTruthy();
  }));

  it('Asynchronous tes with plain Promise', fakeAsync(() => {
    let test = false;
    console.log('Creating Promise');

    Promise.resolve().then(() => {

      console.log('Promise first then() evaluated successfully');
      test = true;
      return Promise.resolve();

    })
      .then(() => {
        console.log('Promise second then() evaluated successfully');
      });
    flushMicrotasks();

    console.log('Running test assertions');
    expect(test).toBeTruthy();

  }));

  it('Asynchronous test example - Promises + setTimeout()', fakeAsync(() => {
      let counter = 0;

      Promise.resolve()
        .then(() => {
          counter += 10;

          setTimeout(() => {
            counter += 1;
          }, 1000);
        });

      expect(counter).toEqual(0);
      flushMicrotasks();
      expect(counter).toBe(10);
      tick(500);
      expect(counter).toBe(10);
      tick(500);
      expect(counter).toBe(11);

    },
  ));

  it('Asynchronous test example - Observables', fakeAsync(() => {
    let test = false;

    console.log('Creating Observable');

    const test$ = of(test).pipe(delay(1000));
    test$.subscribe(() => {
        test = true;
      },
    );
    tick(1000)
    console.log('Running test assertions');
    expect(test).toBe(true);
  }));

});
