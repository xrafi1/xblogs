document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Check authentication status
    const authResponse = await fetch('/api/auth/check');
    if (!authResponse.ok) throw new Error('Failed to check authentication');
    const authStatus = await authResponse.json();

    const loginDiv = document.getElementById('login');
    const adminPanel = document.getElementById('adminPanel');
    const logoutLink = document.getElementById('logoutLink');

    if (authStatus.authenticated) {
      loginDiv.classList.add('hidden');
      adminPanel.classList.remove('hidden');
      logoutLink.classList.remove('hidden');
      await loadPosts();
    } else {
      loginDiv.classList.remove('hidden');
      adminPanel.classList.add('hidden');
      logoutLink.classList.add('hidden');
    }

    // Handle login form submission
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });

        if (response.ok) {
          loginDiv.classList.add('hidden');
          adminPanel.classList.remove('hidden');
          logoutLink.classList.remove('hidden');
          await loadPosts();
        } else {
          alert('Invalid username or password');
        }
      } catch (error) {
        console.error('Login error:', error);
        alert('Error during login. Please try again.');
      }
    });

    // Handle post form submission
    document.getElementById('postForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append('title', document.getElementById('title').value);
      formData.append('content', document.getElementById('content').value);
      formData.append('image', document.getElementById('image').files[0]);

      try {
        const response = await fetch('/api/posts', {
          method: 'POST',
          body: formData
        });
        if (!response.ok) throw new Error('Failed to create post');
        window.location.reload();
      } catch (error) {
        console.error('Error creating post:', error);
        alert('Error creating post. Please try again.');
      }
    });
  } catch (error) {
    console.error('Initialization error:', error);
    document.getElementById('adminPanel').innerHTML = '<p>Error loading admin panel. Please try again later.</p>';
  }
});

async function loadPosts() {
  try {
    const response = await fetch('/api/posts');
    if (!response.ok) throw new Error('Failed to fetch posts');
    const posts = await response.json();

    const postsContainer = document.getElementById('posts');
    postsContainer.innerHTML = '';
    posts.forEach(post => {
      const postElement = document.createElement('div');
      postElement.className = 'post-item';
      postElement.innerHTML = `
        <h3 class="text-xl font-bold">${post.title}</h3>
        <p>${post.content.substring(0, 100)}...</p>
        <button onclick="deletePost('${post._id}')" class="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700">Delete</button>
      `;
      postsContainer.appendChild(postElement);
    });
  } catch (error) {
    console.error('Error loading posts:', error);
    document.getElementById('posts').innerHTML = '<p>Error loading posts. Please try again later.</p>';
  }
}

async function deletePost(id) {
  try {
    const response = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete post');
    window.location.reload();
  } catch (error) {
    console.error('Error deleting post:', error);
    alert('Error deleting post. Please try again.');
  }
}