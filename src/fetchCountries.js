export default function fetchCountries(name) {
  const URL = 'https://restcountries.com/v2/name/';
  const FIELDS = '?fields=name,population,flags,capital,languages';
  return fetch(`${URL}${name}${FIELDS}`).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}
