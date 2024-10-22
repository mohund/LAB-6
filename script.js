const initialLike = 100;
const initialDislike = 20;

let likeCount = initialLike;
let dislikeCount = initialDislike;

// Get all the UI elements
const Likebtn = document.getElementById("likebtn");
const Dislikebtn = document.getElementById("dislikebtn");
const Submitbtn = document.getElementById("submit");
const Resetbtn = document.getElementById("clear");
const CommentBox = document.getElementById("commentBox");
const CommentsList = document.getElementById("commentsList");

// handle like button click
Likebtn.addEventListener("click", () => {
  if (!hasVoted()) {
    likeCount += 1;
    Likebtn.innerHTML = "👍  " + likeCount;
    setCookie("voted", "true", 3600);
    disableButtons();
  }
});

// handle dislike button click
Dislikebtn.addEventListener("click", () => {
  if (!hasVoted()) {
    dislikeCount += 1;
    Dislikebtn.innerHTML = "👎  " + dislikeCount;
    setCookie("voted", "true", 3600);
    disableButtons();
  }
});

// handle submit button click
Submitbtn.addEventListener("click", () => {
  if (hasCommented()) {
    alert("You have already submitted a comment.");
  } else if (CommentBox.value.trim() === "") {
    alert("Please enter a comment");
  } else {
    const pElement = document.createElement("p");
    pElement.innerHTML = CommentBox.value.trim();
    CommentsList.appendChild(pElement);
    setCommentsCookie();
    setCookie("commented", "true", 3600);
    CommentBox.value = "";
  }
});

// Reset functionality
Resetbtn.addEventListener("click", () => {
  likeCount = initialLike;
  dislikeCount = initialDislike;
  Likebtn.innerHTML = "👍  " + likeCount;
  Dislikebtn.innerHTML = "👎  " + dislikeCount;
  CommentBox.value = "";
  CommentsList.innerHTML = "";
  document.cookie = "voted=; max-age=0"; // Clear vote cookie
  document.cookie = "commented=; max-age=0"; // Clear comment cookie
  document.cookie = "comments=; max-age=0"; // Clear comments cookie
  enableButtons();
});

// Check if user has voted
const hasVoted = () => document.cookie.includes("voted");

// Check if user has commented
const hasCommented = () => document.cookie.includes("commented");

// Set cookie function
const setCookie = (name, value, maxAge) => {
  document.cookie = `${name}=${value}; max-age=${maxAge}`;
};

// Handle comments cookie
const setCommentsCookie = () => {
  const comments = Array.from(CommentsList.children).map(p => p.textContent);
  document.cookie = `comments=${encodeURIComponent(JSON.stringify(comments))}; max-age=3600`;
};

// Get comments from cookie
const getCommentsFromCookie = () => {
  const commentsCookie = document.cookie.split("; ").find(row => row.startsWith("comments="));
  if (commentsCookie) {
    return JSON.parse(decodeURIComponent(commentsCookie.split("=")[1]));
  }
  return [];
};

// Disable buttons after voting
const disableButtons = () => {
  [Likebtn, Dislikebtn].forEach(btn => btn.disabled = true);
};

// Enable buttons after reset
const enableButtons = () => {
  [Likebtn, Dislikebtn].forEach(btn => btn.disabled = false);
};

// On page load
window.onload = () => {
  if (hasVoted()) disableButtons();
  if (hasCommented()) Submitbtn.disabled = true;
  
  const savedComments = getCommentsFromCookie();
  savedComments.forEach(comment => {
    const pElement = document.createElement("p");
    pElement.innerHTML = comment;
    CommentsList.appendChild(pElement);
  });
};
