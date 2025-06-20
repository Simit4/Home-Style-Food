// scripts.js

// Initialize Supabase client with your URL and anon key
const supabaseUrl = 'https://hyzwpjxcfuuqipyozhvh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5endwanhjZnV1cWlweW96aHZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0MDAyOTYsImV4cCI6MjA2NTk3NjI5Nn0.1Z88yKnjP8_rY23C5qyt_gQIK5Obb6VAzaUMycts1eo';
const supabase = supabase.createClient(supabaseUrl, supabaseAnonKey);

async function loadRecipes() {
  const { data, error } = await supabase
    .from('recipe_db')
    .select('*');

  if (error) {
    console.error('Error fetching recipes:', error);
    document.getElementById('recipes-container').innerHTML = `<p>Error loading recipes. Please try again later.</p>`;
    return;
  }

  const container = document.getElementById('recipes-container');
  container.innerHTML = '';

  if (!data || data.length === 0) {
    container.innerHTML = '<p>No recipes found.</p>';
    return;
  }

  data.forEach(recipe => {
    container.innerHTML += `
      <div class="recipe-card">
        <h3>${recipe.title}</h3>
        <iframe src="${recipe.video_url}" allowfullscreen></iframe>
        <p>${recipe.description || ''}</p>
        <a href="recipe.html?slug=${recipe.slug}" class="btn-secondary">View Recipe</a>
      </div>
    `;
  });
}

// Run after DOM loads
document.addEventListener('DOMContentLoaded', loadRecipes);
