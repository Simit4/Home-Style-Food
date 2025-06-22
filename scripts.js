

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// ✅ Your Supabase project credentials
const SUPABASE_URL = 'https://ozdwocrbrojtyogolqxn.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96ZHdvY3Jicm9qdHlvZ29scXhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NzE5MzMsImV4cCI6MjA2NjE0NzkzM30.-MAiUtrdza-T2q8POxY-ZcZuZr5QYzFYq5yd-bVYzRQ'  // Replace with your real anon key

// ✅ Initialize Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// ✅ Fetch and show recipes
async function loadRecipes() {
  console.log('Loading recipes...')
  const { data, error } = await supabase.from('recipe_db').select('*')

  if (error) {
    console.error('Error loading recipes:', error.message)
    return
  }

  console.log('Recipes loaded:', data)

  const container = document.getElementById('recipes-container')
  if (!container) {
    console.warn('No container found on page')
    return
  }

  container.innerHTML = data.map(recipe => `
    <div class="recipe-card">
      <h3>${recipe.title}</h3>
      <p>${recipe.description}</p>
      <a href="recipe.html?slug=${recipe.slug}" class="btn-primary">View Recipe</a>
    </div>
  `).join('')
}

// ✅ Run only if the current page needs it
if (window.location.pathname.includes('recipes.html')) {
  loadRecipes()
}
