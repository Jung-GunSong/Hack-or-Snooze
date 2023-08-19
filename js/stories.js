"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Return markup for favorite icons */

function generateFavoritesMarkup(toggleFavorite = UNFAVORITE_CLASS) {
  console.log('ran generate favorites')
  return $(`<span>
              <i class="bi ${toggleFavorite}"></i>
            </span>`);
}

/** Add favorite icons to page */

function putFavoriteIconsOnPage(listOfStories) {
  console.log("put favorite icons on page")
  console.log(listOfStories[0])
  for (let story of listOfStories) {
    console.log('check if favorite', checkIfFavorite(story))
    checkIfFavorite(story)
      ? $(`#${story.storyId}`).prepend(generateFavoritesMarkup(FAVORITE_CLASS))
      : $(`#${story.storyId}`).prepend(generateFavoritesMarkup(UNFAVORITE_CLASS));
  }
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();
console.log("storylist=", storyList.stories)
  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
  putFavoriteIconsOnPage(storyList.stories);
}

/** Gets value from form and adds new story to page */

async function handleStorySubmitForm(evt) {
  evt.preventDefault();
  const author = $("#story-author").val();
  const title = $("#story-title").val();
  const url = $("#story-url").val();

  const story = await storyList.addStory(currentUser, { title, author, url });
  const storyElement = generateStoryMarkup(story);

  $allStoriesList.prepend(storyElement);
  collapseForm();
}

/** event listener for submit form button */

$("#story-form").on("submit", handleStorySubmitForm);

/** Hide and reset form on submission */
//(later) reset form through jQuery trigger??
function collapseForm() {
  $("#story-author").val('');
  $("#story-title").val('');
  $("#story-url").val('');
  $("#story-form").toggle('hidden');
}

/** takes in a story's id and determines whether to add the story to the user's
 * favorites or to remove it from there */

function favoriteOrUnfavoriteStory(id) {
  console.debug("favoriteOrUnfavorite");

  const isFavorite = currentUser.favorites.some((story) => {
    return story.storyId === id;
  });

  isFavorite
    ? currentUser.removeFavorite(Story.getStoryById(id, currentUser.favorites))
    : currentUser.addFavorite(Story.getStoryById(id, storyList.stories));

}

/** event listener change emoji next to story's DOM to show whether it has been
 * declared a favorite story or not */

$allStoriesList.on('click', 'i', function (evt) {
  const targetedId = $(evt.target).closest('li').attr("id");
  favoriteOrUnfavoriteStory(targetedId);

  $(evt.target).toggleClass(`${UNFAVORITE_CLASS}`);
  $(evt.target).toggleClass(`${FAVORITE_CLASS}`);
});

/** generates the user's favorite stories on to the DOM  */

function putStoriesOnFavorites() {
  console.debug("putStoriesOnFavorites");

  $favoriteStoriesList.empty();
console.log("currentUSer favorites=", currentUser.favorites);
  // loop through all of our stories and generate HTML for them
  for (let story of currentUser.favorites) {
    const $story = generateStoryMarkup(story);
    $favoriteStoriesList.prepend($story);
  }

  $favoriteStoriesList.show();
  putFavoriteIconsOnPage(currentUser.favorites);
}

/** event listener to allow user to click on the emoji to either favorite or
 *  unfavorite a story in the favorite story page*/

$favoriteStoriesList.on('click', 'i', function (evt) {
  const targetedId = $(evt.target).closest('li').attr("id");
  favoriteOrUnfavoriteStory(targetedId);

  $(evt.target).toggleClass(`${UNFAVORITE_CLASS}`);
  $(evt.target).toggleClass(`${FAVORITE_CLASS}`);
});

/** takes in the story object return whether the story is included in the user's
 *  favorites or not */

function checkIfFavorite(story) {
  const currentStoryId = story.storyId;
  return currentUser.favorites.some((story) => {
    return story.storyId === currentStoryId;
  });

}