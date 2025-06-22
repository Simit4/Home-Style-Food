import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://ozdwocrbrojtyogolqxn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96ZHdvY3Jicm9qdHlvZ29scXhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NzE5MzMsImV4cCI6MjA2NjE0NzkzM30.-MAiUtrdza-T2q8POxY-ZcZuZr5QYzFYq5yd-bVYzRQ'; // 🔑 Replace this

const supabase = createClient(supabaseUrl, supabaseKey);

async function loadRecipes() {
  const { data, error } = await supabase.from('recipe_db').select('*');

  if (error) {
    console.error('Error loading recipes:', error);
    return;
  }

  const container = document.getElementById('recipes-container');
  container.innerHTML = '';

  data.forEach(recipe => {
    const card = document.createElement('div');
    card.className = 'recipe-card';
    card.innerHTML = `
      <h3>${recipe.title}</h3>
      <p>${recipe.description || ''}</p>
      <a href="recipe.html?slug=${recipe.slug}" class="btn-primary">View Recipe</a>
    `;
    container.appendChild(card);
  });
}

loadRecipes();
