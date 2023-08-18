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
  evt.preventDefault();
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


function favoriteOrUnfavoriteStory(id){
  console.log(`arg id is`, id);
  console.log(`favs of currentUser are`, currentUser.favorites);
  console.log(`a story id of a story in favs`, currentUser.favorites[0].storyId);
  if (currentUser.favorites.some((story) => {
  return story.storyId === id;
  })){
    currentUser.removeFavorite(Story.getStoryById(id));
    console.log(`trying to remove from favorites`);
  }else {
    currentUser.addFavorite(Story.getStoryById(id));
    console.log(`trying to add to favorites`);
  }


}


$allStoriesList.on('click', 'i', function(evt){
  const targetedId= $(evt.target).closest('li').attr("id");
  console.log(`targetId is`, targetedId);
  favoriteOrUnfavoriteStory(targetedId);
})

function createFavoritePage(){

}