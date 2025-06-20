// Your Supabase credentials
const SUPABASE_URL = 'https://hyzwpjxcfuuqipyozhvh.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper to get URL param
function getQueryParam(param) {
  return new URLSearchParams(window.location.search).get(param);
}

// Load all recipes (for recipes.html)
async function loadRecipes() {
  const { data, error } = await supabase.from('recipe-db').select('*');
  if (error) {
    console.error('Error loading recipes:', error);
    return;
  }

  const container = document.getElementById('recipes-container');
  container.innerHTML = '';

  data.forEach(recipe => {
    const card = document.createElement('article');
    card.className = 'recipe-card';

    card.innerHTML = `
      <iframe src="${recipe.video_url}" title="${recipe.title}" allowfullscreen></iframe>
      <h3>${recipe.title}</h3>
      <p>${recipe.description || ''}</p>
      <a href="recipe.html?id=${recipe.id}" class="btn-secondary">View Recipe</a>
    `;

    container.appendChild(card);
  });
}

// Load one recipe (for recipe.html)
async function loadRecipeById(id) {
  const { data: recipe, error } = await supabase
    .from('recipe-db')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !recipe) {
    console.error('Error loading recipe:', error);
    document.getElementById('recipe-content').innerHTML = '<p>Recipe not found.</p>';
    return;
  }

  const content = `
    <h2 class="recipe-title">${recipe.title}</h2>
    <div class="video-wrapper">
      <iframe width="100%" height="400" src="${recipe.video_url}" title="${recipe.title}" allowfullscreen></iframe>
    </div>

    <section class="ingredients-method">
      <div class="ingredients">
        <h3>Ingredients</h3>
        <ul>${recipe.ingredients.map(i => `<li>${i}</li>`).join('')}</ul>
      </div>

      <div class="method">
        <h3>Method</h3>
        <ol>${recipe.method.map(m => `<li>${m}</li>`).join('')}</ol>
      </div>
    </section>

    <button onclick="window.print()" class="btn-primary print-btn">🖨️ Print Recipe</button>
  `;

  document.getElementById('recipe-content').innerHTML = content;
}

// Detect page and load accordingly
window.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('recipes-container')) {
    loadRecipes();
  } else if (document.getElementById('recipe-content')) {
    const id = getQueryParam('id');
    if (id) loadRecipeById(id);
    else document.getElementById('recipe-content').innerHTML = '<p>No recipe selected.</p>';
  }
});
