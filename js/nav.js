"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  evt.preventDefault();
  hidePageComponents();
  putStoriesOnPage();
  $favoriteStoriesList.addClass("hidden");
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  evt.preventDefault();
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();


}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

/** Show story submit form when user clicks story nav link  */

function navSubmitClick() {
  $storyForm.toggle("hidden");
}

$navSubmit.on("click", navSubmitClick)

/** Hides all stories and shows favorite stories */

function navFavoritesClick() {
  $allStoriesList.hide();
  $favoriteStoriesList.removeClass("hidden");
}

$navFavorites.on("click", navFavoritesClick)