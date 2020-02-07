import { fooOne, fooTwo } from '../src';

describe('This is foo-pkg description', () => {
  test('fist func', () => {
    expect(fooOne()).toBe('f1');
  });
  test('second func', () => {
    expect(fooTwo()).toBe('f2');
  });
});
