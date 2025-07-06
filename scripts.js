// scripts.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://ozdwocrbrojtyogolqxn.supabase.co'; // your Supabase URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96ZHdvY3Jicm9qdHlvZ29scXhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NzE5MzMsImV4cCI6MjA2NjE0NzkzM30.-MAiUtrdza-T2q8POxY-ZcZuZr5QYzFYq5yd-bVYzRQ'; // your anon key

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const recipesContainer = document.getElementById('recipes-container');

async function loadAllRecipes() {
  const { data, error } = await supabase
    .from('recipe_db')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    recipesContainer.innerHTML = `<p>Error loading recipes.</p>`;
    console.error(error);
    return;
  }

  if (!data.length) {
    recipesContainer.innerHTML = `<p>No recipes found.</p>`;
    return;
  }

  recipesContainer.innerHTML = data
    .map(recipe => `
      <div class="recipe-card">
        <h3>${recipe.title}</h3>
        <iframe src="${recipe.video_url}" title="${recipe.title}" frameborder="0" allowfullscreen></iframe>
        <p>${recipe.description || ''}</p>
        <a href="recipe.html?slug=${recipe.slug}" class="btn-primary">View Recipe</a>
      </div>
    `)
    .join('');
}

loadAllRecipes();


const searchInput = document.getElementById('search-input');

searchInput.addEventListener('input', function () {
  const searchTerm = this.value.toLowerCase();
  const recipeCards = document.querySelectorAll('.recipe-card');

  recipeCards.forEach(card => {
    const title = card.querySelector('h3').textContent.toLowerCase();
    card.style.display = title.includes(searchTerm) ? 'block' : 'none';
  });
});






