import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://ozdwocrbrojtyogolqxn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96ZHdvY3Jicm9qdHlvZ29scXhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NzE5MzMsImV4cCI6MjA2NjE0NzkzM30.-MAiUtrdza-T2q8POxY-ZcZuZr5QYzFYq5yd-bVYzRQ'; // Replace with your actual anon/public key
const supabase = createClient(supabaseUrl, supabaseKey);

function convertToEmbedUrl(url) {
  if (!url) return '';
  const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : '';
}

async function fetchRecipes() {
  const { data: recipes, error } = await supabase.from('recipe_db').select('*');

  if (error) {
    console.error('Error fetching recipes:', error.message);
    return;
  }

  renderRecipes(recipes);
}

function renderRecipes(recipes) {
  const container = document.getElementById('recipes-container');
  const searchInput = document.getElementById('search-input');

  function displayFiltered(filteredRecipes) {
    container.innerHTML = '';
    filteredRecipes.forEach(recipe => {
      const card = document.createElement('div');
      card.classList.add('recipe-card');

      const embedUrl = convertToEmbedUrl(recipe.video_url);

      card.innerHTML = `
        <div class="video-wrapper">
          ${embedUrl ? `<iframe src="${embedUrl}" allowfullscreen></iframe>` : ''}
        </div>
        <a href="recipe.html?slug=${recipe.slug}">
          <h3>${recipe.title}</h3>
          <p>${recipe.description || ''}</p>
        </a>
      `;

      container.appendChild(card);
    });
  }

  // Initial display
  displayFiltered(recipes);

  // Live search
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    const filtered = recipes.filter(r =>
      r.title.toLowerCase().includes(query) ||
      r.description?.toLowerCase().includes(query)
    );
    displayFiltered(filtered);
  });
}

fetchRecipes();
