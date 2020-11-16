import userCoords from '../coords';

test('with space', () => {
  const string = '51.50851, -0.12572';
  expect(userCoords(string)).toEqual({ result: true, latitude: 51.50851, longitude: -0.12572 });
});

test('without space', () => {
  const string = '51.50851,-0.12572';
  expect(userCoords(string)).toEqual({ result: true, latitude: 51.50851, longitude: -0.12572 });
});

test('skobki', () => {
  const string = '[51.50851, -0.12572]';
  expect(userCoords(string)).toEqual({ result: true, latitude: 51.50851, longitude: -0.12572 });
});
