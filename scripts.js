const SUPABASE_URL = 'https://hyzwpjxcfuuqipyozhvh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5endwanhjZnV1cWlweW96aHZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0MDAyOTYsImV4cCI6MjA2NTk3NjI5Nn0.1Z88yKnjP8_rY23C5qyt_gQIK5Obb6VAzaUMycts1eo';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function loadRecipes() {
  const { data, error } = await supabase.from('recipes').select('*');

  if (error) {
    console.error('Error fetching recipes:', error);
    return;
  }

  const container = document.getElementById('recipes-container');
  if (!container) return;

  container.innerHTML = data.map(recipe => `
    <article class="recipe-card">
      <iframe width="100%" height="200" src="${recipe.video}" title="${recipe.title}" allowfullscreen></iframe>
      <h3>${recipe.title}</h3>
      <a class="btn-secondary" href="recipe.html?id=${recipe.id}">View Recipe</a>
    </article>
  `).join('');
}

async function loadSingleRecipe() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) return;

  const { data, error } = await supabase.from('recipes').select('*').eq('id', id).single();
  if (error) {
    console.error('Error loading recipe:', error);
    return;
  }

  document.getElementById('recipe-title').textContent = data.title;
  document.getElementById('video-frame').src = data.video;
  document.getElementById('ingredients-list').innerHTML = data.ingredients.map(i => `<li>${i}</li>`).join('');
  document.getElementById('method-steps').innerHTML = data.method.map(s => `<li>${s}</li>`).join('');
}

if (document.getElementById('recipes-container')) loadRecipes();
if (document.getElementById('recipe-title')) loadSingleRecipe();
