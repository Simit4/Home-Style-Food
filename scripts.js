import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://ozdwocrbrojtyogolqxn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96ZHdvY3Jicm9qdHlvZ29scXhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NzE5MzMsImV4cCI6MjA2NjE0NzkzM30.-MAiUtrdza-T2q8POxY-ZcZuZr5QYzFYq5yd-bVYzRQ'; // Replace with your actual anon/public key
const supabase = createClient(supabaseUrl, supabaseKey);

// Utility: Convert YouTube URL to thumbnail
function getYouTubeThumbnail(url) {
  const match = url?.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : '';
}

// Fetch and render all recipes
async function fetchRecipes() {
  const { data: recipes, error } = await supabase
    .from('recipe_db')
    .select('title, slug, description, video_url, thumbnail_url');

  if (error) {
    console.error('Error loading recipes:', error.message);
    return;
  }

  const container = document.getElementById('recipes-container');
  container.innerHTML = '';

  recipes.forEach(recipe => {
    const thumbUrl = recipe.thumbnail_url || getYouTubeThumbnail(recipe.video_url);

    const card = document.createElement('div');
    card.className = 'recipe-card';

    card.innerHTML = `
      <div class="thumbnail-wrapper">
        <img src="${thumbUrl}" alt="${recipe.title}" class="recipe-thumb">
        ${recipe.video_url ? `<div class="play-icon"><i class="fas fa-play-circle"></i></div>` : ''}
      </div>
      <h3>${recipe.title}</h3>
      <p>${recipe.description}</p>
      <a href="recipe.html?slug=${recipe.slug}" class="view-btn">View Recipe</a>
    `;

    container.appendChild(card);
  });
}

// Optional: Search filter
document.getElementById('search-input')?.addEventListener('input', function () {
  const keyword = this.value.toLowerCase();
  const cards = document.querySelectorAll('.recipe-card');

  cards.forEach(card => {
    const text = card.textContent.toLowerCase();
    card.style.display = text.includes(keyword) ? '' : 'none';
  });
});

fetchRecipes();
