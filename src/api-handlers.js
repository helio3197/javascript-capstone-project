const MEALSDB_API = 'https://www.themealdb.com/api/json/v1/1/filter.php?a=Mexican';
const LIKES_API = 'https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/BnjmjUJJQAhlumcZxnbj/likes/';

const getLikes = async () => {
  const response = await fetch(LIKES_API);
  const likesList = await response.json().catch(() => false);
  if (!likesList) return false;
  const likesObj = {};
  likesList.forEach((item) => { likesObj[item.item_id] = item.likes; });
  return likesObj;
};

const sendLike = (id) => {
  fetch(LIKES_API, {
    method: 'POST',
    body: JSON.stringify({
      item_id: id,
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });
};

const getMealsList = async () => {
  const response = await fetch(MEALSDB_API);
  const mealsList = await response.json();
  return mealsList;
};

export { getMealsList, getLikes, sendLike };
