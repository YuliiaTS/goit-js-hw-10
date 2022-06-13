import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import Notiflix from 'notiflix';
import Debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;
const inputEl = document.querySelector('#search-box');
const listEl = document.querySelector('.country-list');
const infoDivEl = document.querySelector('.country-info');

inputEl.addEventListener('input', Debounce(onInputCountrySearch, DEBOUNCE_DELAY));

function onInputCountrySearch(e) {
  const searchCountry = e.target.value.trim();
  listEl.innerHTML = '';
  infoDivEl.innerHTML = '';

  if (searchCountry !== '') {
    fetchCountries(searchCountry)
      .then(response => {
        if (response.length === 1) {
          infoDivEl.insertAdjacentHTML('beforeend', renderCountriesInfo(response));
        } else if (response.length > 10) {
          Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
        } else {
          listEl.insertAdjacentHTML('beforeend', renderCountriesList(response));
        }
      })  
      .catch(error => {
        console.log(error);
        Notiflix.Notify.failure('Oops, there is no country with that name');
      });
  }
}

function renderCountriesList(array) {
  return array.map(({ name, flags }) =>
    `<li class="country-list__item">
    <img class="country-list__img" src="${flags.svg}" alt="flag of ${name}" width="25" height="25">
    <p class="country-list__name">${name.official}</p>
    </li>`
    )
    .join('');
}

function renderCountriesInfo(array) {
  return array.map(({ name, capital, population, flags, languages }) => `
    <div class="country-info__wrap">
        <img class="country-info__img" src="${flags.svg}" alt="flag of ${name}" width="25" height="25">
        <h2 class="country-info__title">${name.official}</h2>
    </div>
    <div class="country-info__list">
        <p class="country-info__item">Capital:
            <span class="country-info__item-text">${capital}</span>
        </p>
        <p class="country-info__item">Population:
            <span class="country-info__item-text">${population}</span>
        </p>
        <p class="country-info__item">Languages:
            <span class="country-info__item-text">${Object.values(languages)}</span>
        </p>
    </div>
`).join('');
};
