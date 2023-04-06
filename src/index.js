import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;
const input = document.querySelector('input#search-box');
const countriesBox = document.querySelector('.country-list');
const countriesInfo = document.querySelector('.country-info');

function renderCountriesList(countries) {
  const countriesMarkup = countries
    .map(({ flags, name }) => {
      return `
        <li class="country-item">
        <img class="country-img"
            src="${flags.svg}"
            alt="${name} flag"
        >${name}</li>
    `;
    })
    .join(', ');
}

function renderCountryItem(country) {
  const countryMarkup = country
    .map(({ flags, name, population, languages, capital }) => {
      return `<div>
          <p class="country-desc">
          <img class="country-img"
            src="${flags.svg}"
            alt="${name} flag">${name}</p>
          <ul class="countries-list">
            <li class="country-item">Capital: ${capital}</li>
            <li class="country-item">Population: ${population}</li>
            <li class="country-item">Languages: ${languages}</li>
        </ul>
      </div>`;
    })
    .join(', ');
}

function searchCountries(e) {
  countriesBox.innerHTML = '';
  countriesInfo.innerHTML = '';

  const name = e.target.value;
  console.log(name);
  if (name === '') {
    return;
  }

  fetchCountries(name)
    .then(result => {
      if (result.length > 10) {
        Notify.success(
          'Too many matches found. Please enter a more specific name.'
        );
        if (result.length > 1) {
          //   countriesBox.insertAdjacentHTML(
          //     'beforeend',
          //     renderCountriesList(result)

          //   );
          console.log(1);
        } else
          countriesInfo.insertAdjacentHTML(
            'beforeend',
            renderCountryItem(result[0])
          );
      }
    })
    .catch(err => {
      Notify.failure('Oops, there is no country with that name');
    });
}

input.addEventListener('input', debounce(searchCountries, DEBOUNCE_DELAY));
