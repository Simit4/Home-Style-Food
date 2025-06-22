import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://ozdwocrbrojtyogolqxn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96ZHdvY3Jicm9qdHlvZ29scXhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NzE5MzMsImV4cCI6MjA2NjE0NzkzM30.-MAiUtrdza-T2q8POxY-ZcZuZr5QYzFYq5yd-bVYzRQ';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const urlParams = new URLSearchParams(window.location.search);
const slug = urlParams.get('slug');

const titleEl = document.getElementById('recipe-title');
const descEl = document.getElementById('recipe-description');
const ingredientsList = document.getElementById('recipe-ingredients');  // <-- Fixed ID
const methodList = document.getElementById('recipe-method');           // <-- Fixed ID
const videoFrame = document.getElementById('recipe-video');

async function loadRecipe() {
  if (!slug) {
    titleEl.textContent = 'No recipe specified.';
    return;
  }

  const { data, error } = await supabase
    .from('recipe_db')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    titleEl.textContent = 'Recipe not found.';
    console.error(error);
    return;
  }

  titleEl.textContent = data.title;
  descEl.textContent = data.description || '';

  ingredientsList.innerHTML = '';
  if (Array.isArray(data.ingredients)) {
    data.ingredients.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      ingredientsList.appendChild(li);
    });
  }

  methodList.innerHTML = '';
  if (Array.isArray(data.method)) {
    data.method.forEach(step => {
      const li = document.createElement('li');
      li.textContent = step;
      methodList.appendChild(li);
    });
  }

  videoFrame.src = data.video_url || '';
  videoFrame.title = data.title;
}

document.addEventListener('DOMContentLoaded', () => {
  loadRecipe();
});
