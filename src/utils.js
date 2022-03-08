import {
  getMealsList, getLikes, sendLike, getMealDetalis, getComments, sendComment,
} from './api-handlers.js';

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
        const modalHeader = document.querySelector('.modal-title');
        const modalBody = document.querySelector('.modal-body');
        modalHeader.innerHTML = 'LOADING ...';
        modalBody.innerHTML = '';
        getComments(id).then((commentsList) => {
          getMealDetalis(id).then((res) => {
            modalHeader.innerHTML = res.strMeal;
            modalBody.innerHTML = `
            <img src="${res.strMealThumb}" alt="${res.strMeal}" class="w-100">
            <h3>${res.strCategory}</h3>
            <h4>${res.strArea}</h4>
            <h5>${res.strTags}</h5>
            <p>${res.strInstructions}</p>
            <h6>Comments (${commentsList.length})</h6>
            <ul id="comments-list">
              ${(() => { if (commentsList.length === 0) return 'There are no comments yet'; return `${commentsList.map((item) => `<li>${item.creation_date} ${item.username}: ${item.comment}</li>`).join('')}`; })()}
            </ul>
            <h5>Add a comment</h5>
            <form id="comments-form">
              <label for="name" hidden>Enter name</label>
              <input type="text" required placeholder="Your Name" id="name" name="name">
              <label for="message" hidden>Enter comment</label>
              <input type="text" required placeholder="Your Insights" id="message" name="message">
            </form>
            `;
            document.getElementById('comments-form').addEventListener('submit', (e) => {
              e.preventDefault();
              const form = e.currentTarget.elements;
              const username = form.name.value;
              const comment = form.message.value;
              sendComment(id, username, comment).then((r) => {
                if (r.ok) {
                  console.log('sucess');
                  getComments(id).then((commentsList) => {
                    const lastComment = commentsList.at(-1);
                    const newCommentEl = document.createElement('li');
                    newCommentEl.innerHTML = `${lastComment.creation_date} ${lastComment.username}: ${lastComment.comment}`;
                    document.getElementById('comments-list').appendChild(newCommentEl);
                  });
                } else alert('something went wrong');
              });
              form.name.value = '';
              form.message.value = '';
            });
          });
        });
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
      for (let i = 0; i < likeBtns.length; i += 1) {
        likeBtns[i].addEventListener('click', likeFunc);
        commentBtns[i].addEventListener('click', openModal);
      }
    });
  });
};

export { showMealList as default };
