import './css/styles.css';
import fetchCountries from './fetchCountries.js';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';

const DEBOUNCE_DELAY = 300;
const input = document.querySelector('input#search-box');
const countriesList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

const renderCountry = country => {
  const { name, capital, population, languages, flags } = country;
  const allLanguages = languages.map(language => language.name).join(', ');
  return `
      <div>
        <img src="${flags.svg}" alt="${name} flag">
        <div>
          <h2>${name}</h2>
          <p><strong>Capital:</strong> ${capital}</p>
          <p><strong>Population:</strong> ${population}</p>
          <p><strong>Languages:</strong> ${allLanguages}</p>
        </div>
      </div>
    `;
};

const renderCountries = countries => {
  const countriesList = countries.map(
    country =>
      `<div><img src="${country.flags.svg}" alt="${country.name} flag">${country.name}</div>`
  );
  return countriesList.join('');
};

const searchCountries = () => {
  const name = input.value.trim();
  if (!name) {
    countryInfo.innerHTML = '';
    countriesList.innerHTML = '';
    return;
  }
  const hideRender = () => {
    countryInfo.innerHTML = '';
    countriesList.innerHTML = '';
  };

  fetchCountries(name)
    .then(countries => {
      if (countries.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        hideRender();
        return;
      }
      if (countries.length > 1 && countries.length < 10) {
        countryInfo.innerHTML = '';
        countriesList.insertAdjacentHTML(
          'beforeend',
          renderCountries(countries)
        );
        return;
      }
      if (countries.length === 1) {
        hideRender();
        countryInfo.insertAdjacentHTML(
          'beforeend',
          renderCountry(countries[0])
        );
        return;
      }
    })
    .catch(error => {
      Notify.failure('Oops, something went wrong! Please try again.');
      hideRender();
      console.log(error);
    });
};

input.addEventListener('input', debounce(searchCountries, DEBOUNCE_DELAY));
