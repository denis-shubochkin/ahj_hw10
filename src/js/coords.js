export default function userCoords(string) {
  if (string !== '' && string.indexOf(',') !== -1) {
    const latitude = string.slice(0, string.indexOf(',')).trim().replace(/\[|\]/g, '');
    const longitude = string.slice(string.indexOf(',') + 1).trim().replace(/\[|\]/g, '');
    if (latitude.indexOf('.') !== -1 && longitude.indexOf('.') !== -1) {
      return { result: true, latitude: Number(latitude), longitude: Number(longitude) };
    }
  }
  throw new Error('Введен некорректный формат данных');
}
