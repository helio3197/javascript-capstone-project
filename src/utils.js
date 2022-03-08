import { getMealsList, getLikes } from './api-handlers.js';

const showMealList = () => {
  let likesObj;

  getLikes().then((res) => { likesObj = res; });

  getMealsList().then((res) => {
    const mealsHtml = document.getElementById('meals-list');
    mealsHtml.innerHTML = `
    ${res.meals.map((item) => `
    <div class="col-4 border d-flex flex-column">
      <img src="${item.strMealThumb}/preview" alt="${item.strMeal}">
      <div class="d-flex align-items-center justify-content-between">
        <h2>${item.strMeal}</h2>
        <div>
          <button type="button" class="fa-regular fa-heart"></button>
          <span>${(() => { if (!likesObj.idMeal) return 0; return likesObj.idMeal; })()}</span>
        </div>
      </div>
      <button type="button">Comments</button>
    </div>`).join('')}`;
  });
};

export { showMealList as default };
