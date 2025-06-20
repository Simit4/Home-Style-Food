// Import Supabase client from CDN or npm (if not already imported in your HTML)
// Assuming you include this in your HTML:
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

// Your Supabase project URL and anon key - replace with your actual values

const SUPABASE_URL = 'https://hyzwpjxcfuuqipyozhvh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5endwanhjZnV1cWlweW96aHZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0MDAyOTYsImV4cCI6MjA2NTk3NjI5Nn0.1Z88yKnjP8_rY23C5qyt_gQIK5Obb6VAzaUMycts1eo'; // replace with your anon key

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function loadRecipes() {
  const { data, error } = await supabase.from('recipe-db').select('*');

  if (error) {
    console.error('Error fetching recipes:', error);
    document.getElementById('recipes-container').innerHTML = `<p>Error loading recipes. Please try again later.</p>`;
    return;
  }

  if (!data || data.length === 0) {
    document.getElementById('recipes-container').innerHTML = `<p>No recipes found.</p>`;
    return;
  }

  const container = document.getElementById('recipes-container');
  container.innerHTML = '';

  data.forEach(recipe => {
    const card = document.createElement('article');
    card.classList.add('recipe-card');

    card.innerHTML = `
      <iframe src="${recipe.video}" title="${recipe.title}" allowfullscreen></iframe>
      <h3>${recipe.title}</h3>
      <p>${recipe.description || ''}</p>
      <a href="recipe.html?id=${recipe.id}" class="btn-secondary">View Recipe</a>
    `;

    container.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', loadRecipes);
