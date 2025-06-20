const SUPABASE_URL = 'https://YOUR-PROJECT-URL.supabase.co'; // replace
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5endwanhjZnV1cWlweW96aHZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0MDAyOTYsImV4cCI6MjA2NTk3NjI5Nn0.1Z88yKnjP8_rY23C5qyt_gQIK5Obb6VAzaUMycts1eo'; // replace

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Fetch all recipes
async function fetchRecipes() {
  const { data, error } = await supabase
    .from('recipes')
    .select('*');

  if (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }
  return data;
}

// Render recipe cards on pages
async function renderRecipes(containerId, featured = false) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const recipes = await fetchRecipes();

  let filtered = recipes;
  if (featured) {
    filtered = recipes.slice(0, 3); // show first 3 featured
  }

  container.innerHTML = '';

  filtered.forEach(recipe => {
    const card = document.createElement('article');
    card.className = 'recipe-card';

    card.innerHTML = `
      <iframe src="${recipe.video}" allowfullscreen frameborder="0" ></iframe>
      <h3>${recipe.title}</h3>
      <button class="btn-secondary" onclick="toggleDetails('${recipe.id}')">View Recipe</button>
      <div id="details-${recipe.id}" class="recipe-details" style="display:none; padding: 1rem; color:#444;">
        <h4>Ingredients</h4>
        <ul>${recipe.ingredients.map(i => `<li>${i}</li>`).join('')}</ul>
        <h4>Method</h4>
        <ol>${recipe.method.map(m => `<li>${m}</li>`).join('')}</ol>
      </div>
    `;

    container.appendChild(card);
  });
}

function toggleDetails(id) {
  const el = document.getElementById(`details-${id}`);
  if (el.style.display === 'none') {
    el.style.display = 'block';
  } else {
    el.style.display = 'none';
  }
}

// Initialize based on page
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('featured-recipes')) {
    renderRecipes('featured-recipes', true);
  }
  if (document.getElementById('recipes-container')) {
    renderRecipes('recipes-container');
  }
});
