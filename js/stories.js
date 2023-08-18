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

function generateStoryMarkup(story, toggleFavorite=UNFAVORITE_CLASS) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  //check story in currentuser.favorites, if favorite change togglefavorite
  return $(`
      <li id="${story.storyId}">
        <span>
          <i class="bi ${toggleFavorite}"></i>
        </span>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
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

$("#story-form").on("submit", handleStorySubmitForm);

/** Hide form on submission */
//TODO: (later) reset form through jQuery trigger
function collapseForm() {
  $("#story-author").val('');
  $("#story-title").val('');
  $("#story-url").val('');
  $("#story-form").toggle('hidden');
}


function favoriteOrUnfavoriteStory(id){
  console.log(`arg id is`, id);
  console.log(`favs of currentUser are`, currentUser.favorites);
  console.log(`a story id of a story in favs`, currentUser.favorites[0].storyId);
  if (currentUser.favorites.some((story) => {
  return story.storyId === id; //don't put too much stuff in if statement
  })){
    currentUser.removeFavorite(Story.getStoryById(id, currentUser.favorites));
    console.log(`trying to remove from favorites`);
  }else {
    currentUser.addFavorite(Story.getStoryById(id, storyList.stories));
    console.log(`trying to add to favorites`);
  }


}


$allStoriesList.on('click', 'i', function(evt){
  const targetedId= $(evt.target).closest('li').attr("id");
  console.log(`target is`, $(evt.target));
  favoriteOrUnfavoriteStory(targetedId);
  $(evt.target).toggleClass(`${UNFAVORITE_CLASS}`);
  $(evt.target).toggleClass(`${FAVORITE_CLASS}`);
})

function putStoriesOnFavorites() {
  console.debug("putStoriesOnFavorites");

  $favoriteStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of currentUser.favorites) {
    console.log(`favs of current user are`, currentUser.favorites);
    console.log(`story is`, story);
    const $story = generateStoryMarkup(story, FAVORITE_CLASS);
    $favoriteStoriesList.prepend($story);
  }

}

$favoriteStoriesList.on('click', 'i', function(evt){
  const targetedId= $(evt.target).closest('li').attr("id");
  console.log(`The star' story id is`,targetedId);
  favoriteOrUnfavoriteStory(targetedId);
})