document.addEventListener('DOMContentLoaded', async () => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    const response = await fetch(`/api/posts/${postId}`);
    if (!response.ok) throw new Error('Failed to fetch post');
    const post = await response.json();

    const postContainer = document.getElementById('post');
    postContainer.innerHTML = `
      <h1 class="text-3xl font-bold mb-4">${post.title}</h1>
      <img src="${post.image || '/placeholder.jpg'}" alt="${post.title}" class="w-full h-64 object-cover mb-4">
      <p class="text-gray-700">${post.content}</p>
      <p class="text-gray-500 mt-4">Posted on ${new Date(post.createdAt).toLocaleDateString()}</p>
    `;
  } catch (error) {
    console.error('Error loading post:', error);
    document.getElementById('post').innerHTML = '<p>Error loading post. Please try again later.</p>';
  }
});