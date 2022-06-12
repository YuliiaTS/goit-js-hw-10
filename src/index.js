import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import Notiflix from 'notiflix';
import Debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;
const inputEl = document.querySelector('#search-box');
const listEl = document.querySelector('.country-list');
const infoDivEl = document.querySelector('.country-info');

inputEl.addEventListener(
  'input',
  Debounce(onInputCountrySearch, DEBOUNCE_DELAY)
);

function onInputCountrySearch(e) {
  const searchCountry = e.target.value.trim();
//   console.log(searchCountry);
  listEl.innerHTML = '';
  infoDivEl.innerHTML = '';

  if (searchCountry !== '') {
    fetchCountries(searchCountry)
      .then(response => {
        console.log(response);
        if (searchCountry.length === 1) {
            infoDivEl.insertAdjacentHTML('beforeend', renderCountriesInfo(response));
        }
      })
      .catch(error => {
        console.log(error);
        Notiflix.Notify.failure('Oops, there is no country with that name');
      });
  }
}

function renderCountriesList(array) {
  return array
    .map(({ name, flags } ) =>
    `<li class="country-list__item">
    <img class="country-list__img" src="${flags.svg}" alt="flag of ${name}" width="25" height="25">
    <p class="country-list__name">"${name.official}"</p>
    </li>`
    )
    .join('');
}
listEl.insertAdjacentHTML('beforeend', renderCountriesList());

const renderCountriesInfo = array => {
  return array.map(({ name, capital, population, flags, languages }) => `
    <div class="country-info__wrap">
        <img class="country-info__img" src="${flags.svg}" alt="${name}" width="25" height="25">
        <h2 class="country-info__title">"${name.official}"</h2>
    </div>
    <ul class="country-info__list">
        <li class="country-info__item">Capital:
            <span class="country-info__item-text">"${capital}"</span>
        </li>
        <li class="country-info__item">Population:
            <span class="country-info__item-text">"${population}"</span>
        </li>
        <li class="country-info__item">Languages:
            <span class="country-info__item-text">"${languages}"</span>
        </li>
    </ul>
`).join('');
};
infoDivEl.insertAdjacentHTML('beforeend', renderCountriesInfo());
