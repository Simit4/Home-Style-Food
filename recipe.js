// recipe.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// 🔐 Your Supabase credentials
const SUPABASE_URL = 'https://ozdwocrbrojtyogolqxn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96ZHdvY3Jicm9qdHlvZ29scXhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NzE5MzMsImV4cCI6MjA2NjE0NzkzM30.-MAiUtrdza-T2q8POxY-ZcZuZr5QYzFYq5yd-bVYzRQ'; // Replace with your actual anon key

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Get the slug from the URL
const params = new URLSearchParams(window.location.search);
const slug = params.get('slug');

const recipeContainer = document.getElementById('recipe-content');

async function loadRecipe() {
  if (!slug) {
    recipeContainer.innerHTML = "<p>Recipe not found.</p>";
    return;
  }

  const { data, error } = await supabase
    .from('recipe_db')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) {
    recipeContainer.innerHTML = "<p>Error loading recipe.</p>";
    console.error("Error fetching recipe:", error);
    return;
  }

  const { title, video_url, ingredients, method, description } = data;

  recipeContainer.innerHTML = `
    <div class="recipe-detail">
      <div class="recipe-video">
        <iframe src="${video_url}" frameborder="0" allowfullscreen></iframe>
      </div>
      <div class="recipe-info">
        <h2>${title}</h2>
        <p>${description || ''}</p>
        <h3>🛒 Ingredients</h3>
        <ul>${ingredients.map(item => `<li>${item}</li>`).join('')}</ul>
        <h3>👨‍🍳 Method</h3>
        <ol>${method.map(step => `<li>${step}</li>`).join('')}</ol>
      </div>
    </div>
  `;
}

loadRecipe();
