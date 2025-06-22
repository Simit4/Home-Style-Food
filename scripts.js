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

 const recipesContainer = document.getElementById('recipes-container');

async function loadRecipes() {
  // Initialize Supabase (use your own keys)
  const supabaseUrl = 'https://your-project-url.supabase.co';
  const supabaseKey = 'your-anon-key';
  const supabase = supabase.createClient(supabaseUrl, supabaseKey);

  let { data: recipes, error } = await supabase
    .from('recipe_db')
    .select('*');

  if (error) {
    console.error('Error fetching recipes:', error);
    recipesContainer.innerHTML = '<p>Failed to load recipes.</p>';
    return;
  }

  recipesContainer.innerHTML = ''; // clear container

  recipes.forEach(recipe => {
    const card = document.createElement('div');
    card.classList.add('recipe-card');

    card.innerHTML = `
      <h3><a href="recipe.html?slug=${encodeURIComponent(recipe.slug)}">${recipe.title}</a></h3>
      <p>${recipe.description || ''}</p>
      <iframe width="100%" height="180" src="${recipe.video_url}" frameborder="0" allowfullscreen></iframe>
    `;

    recipesContainer.appendChild(card);
  });
}

loadRecipes();
