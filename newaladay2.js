const POSTS_FEED_URL = '/feeds/posts/default?alt=json&max-results=100';
const POSTS_PER_PAGE = 10;
let posts = [];
let currentPage = 1;

// Fetch posts from the Blogger feed
async function fetchPosts() {
  try {
    const response = await fetch(POSTS_FEED_URL);
    const data = await response.json();
    posts = data.feed.entry || [];
    renderPosts();
    renderPagination();
  } catch (error) {
    console.error('Error fetching posts:', error);
  }
}

// Render posts on the current page
function renderPosts() {
  const postList = document.getElementById('post-list');
  postList.innerHTML = '';
  const start = (currentPage - 1) * POSTS_PER_PAGE;
  const end = start + POSTS_PER_PAGE;
  const currentPosts = posts.slice(start, end);

  currentPosts.forEach(post => {
    const listItem = document.createElement('li');
    const link = document.createElement('a');
    link.href = post.link.find(link => link.rel === 'alternate').href;

    // Create a span for the title
    const titleSpan = document.createElement('span');
    titleSpan.textContent = post.title.$t;
    titleSpan.className = 'post-title'; // Add a class for styling

    // Create a span for the publication date
    const publishedDate = new Date(post.published.$t);
    const formattedDate = publishedDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const dateSpan = document.createElement('span');
    dateSpan.textContent = formattedDate;
    dateSpan.className = 'post-date'; // Add a class for styling

    // Append both spans to the link
    link.appendChild(dateSpan);
    link.appendChild(titleSpan);

    // Add the link to the list item and append to the list
    listItem.appendChild(link);
    postList.appendChild(listItem);
  });
}

// Render pagination buttons
function renderPagination() {
  const pagination = document.getElementById('pagination');
  pagination.innerHTML = '';
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement('button');
    button.textContent = i;
    button.className = i === currentPage ? 'active' : '';
    button.onclick = () => {
      currentPage = i;
      renderPosts();
      renderPagination();
    };
    pagination.appendChild(button);
  }
}

// Initialize posts fetching
fetchPosts();
