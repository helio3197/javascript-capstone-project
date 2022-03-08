import { getMealsList, getLikes, sendLike } from './api-handlers.js';

const showMealList = () => {
  getLikes().then((likesObj) => {
    getMealsList().then((res) => {
      const mealsHtml = document.getElementById('meals-list');
      mealsHtml.innerHTML = `
      ${res.meals.map((item) => `
      <div class="col-4 border d-flex flex-column" id="${item.idMeal}">
        <img src="${item.strMealThumb}/preview" alt="${item.strMeal}">
        <div class="d-flex align-items-center justify-content-between">
          <h2>${item.strMeal}</h2>
          <div>
            <button type="button" class="fa-regular fa-heart like-btn"></button>
            <span>${(() => { if (!!likesObj[item.idMeal] === false) return '0 likes'; return `${likesObj[item.idMeal]} likes`; })()}</span>
          </div>
        </div>
        <button type="button" class="comment-btn" data-bs-toggle="modal" data-bs-target="#recipe-modal">Comments</button>
      </div>`).join('')}`;
      const commentBtns = document.querySelectorAll('.comment-btn');
      const openModal = (e) => {
        const currentCommentBtn = e.target;
        const { id } = currentCommentBtn.parentNode;
        const modalHeader = document.querySelector('.modal-header');
        modalHeader.innerHTML = 'TEXT';
      };
      const likeBtns = document.querySelectorAll('.like-btn');
      const likeFunc = (e) => {
        const currentLikeBtn = e.target;
        const { id } = currentLikeBtn.parentNode.parentNode.parentNode;
        const numberLikes = currentLikeBtn.parentNode.lastElementChild;
        numberLikes.innerHTML = `${+(numberLikes.innerHTML.split('')[0]) + 1} likes`;
        currentLikeBtn.classList.replace('fa-regular', 'fa-solid');
        sendLike(id);
        currentLikeBtn.removeEventListener('click', likeFunc);
      };
      // likeBtns.forEach((item) => item.addEventListener('click', likeFunc));
      for (let i = 0; i < likeBtns.length; i += 1) {
        likeBtns[i].addEventListener('click', likeFunc);
        commentBtns[i].addEventListener('click', openModal);
      }
    });
  });
};

export { showMealList as default };
