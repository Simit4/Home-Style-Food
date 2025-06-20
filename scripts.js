const SUPABASE_URL = 'https://YOUR-PROJECT-URL.supabase.co'; // replace
const SUPABASE_ANON_KEY = 'YOUR-ANON-KEY'; // replace

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
