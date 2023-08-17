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
        <span>
          <i class="bi bi-star"></i>
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
  // evt.preventDefault(); not necessary?
  const author = $("#story-author").val();
  const title = $("#story-title").val();
  const url = $("#story-url").val();

  const story = await storyList.addStory(currentUser, { title, author, url });
  const storyElement = generateStoryMarkup(story);
  //TODO: Prepend to DOM using global constants
  // getAndShowStoriesOnStart();
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

function favoriteOrUnfavoriteStory(){
  currentUser.favorites.some((story) => {
  return story.storyId === Story.getStoryId(this);
  }) ? currentUser.removeFavorite(this) :
    currentUser.addFavorite(this);

}

function createFavoritePage(){

}