import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://ozdwocrbrojtyogolqxn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96ZHdvY3Jicm9qdHlvZ29scXhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NzE5MzMsImV4cCI6MjA2NjE0NzkzM30.-MAiUtrdza-T2q8POxY-ZcZuZr5QYzFYq5yd-bVYzRQ';


const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const urlParams = new URLSearchParams(window.location.search);
const slug = urlParams.get('slug');

const titleEl = document.getElementById('recipe-title');
const descEl = document.getElementById('recipe-description');
const ingredientsList = document.getElementById('recipe-ingredients');
const methodList = document.getElementById('recipe-method');
const videoFrame = document.getElementById('recipe-video');

const prepTimeEl = document.getElementById('prep-time');
const cookTimeEl = document.getElementById('cook-time');
const servingsEl = document.getElementById('servings');
const nutritionEl = document.getElementById('nutrition-info');
const categoryEl = document.getElementById('category');
const cuisineEl = document.getElementById('cuisine');
const notesList = document.getElementById('recipe-notes-list');
const factsEl = document.getElementById('recipe-facts');

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

  // Populate fields
  titleEl.textContent = data.title;
  descEl.textContent = data.description || '';

  prepTimeEl.textContent = data.prep_time || '--';
  cookTimeEl.textContent = data.cook_time || '--';
  servingsEl.textContent = data.servings || '--';
  nutritionEl.textContent = data.nutrition || '--';
  categoryEl.textContent = data.category || '--';
  cuisineEl.textContent = data.cuisine || '--';

  // Ingredients
  ingredientsList.innerHTML = '';
  if (Array.isArray(data.ingredients)) {
    data.ingredients.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      ingredientsList.appendChild(li);
    });
  }

  // Method
  methodList.innerHTML = '';
  if (Array.isArray(data.method)) {
    data.method.forEach(step => {
      const li = document.createElement('li');
      li.textContent = step;
      methodList.appendChild(li);
    });
  }

  // Notes
  notesList.innerHTML = '';
  if (Array.isArray(data.notes)) {
    data.notes.forEach(note => {
      const li = document.createElement('li');
      li.textContent = note;
      notesList.appendChild(li);
    });
  }

  // Facts
  factsEl.textContent = data.facts || '';

  // Video
  videoFrame.src = data.video_url || '';
  videoFrame.title = data.title;

  // Update Share Links
  const pageUrl = window.location.href;
  const encodedTitle = encodeURIComponent(data.title);

  document.getElementById('share-facebook').href =
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`;

  document.getElementById('share-twitter').href =
    `https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodedTitle}`;

  document.getElementById('share-whatsapp').href =
    `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodeURIComponent(pageUrl)}`;

  document.getElementById('share-email').href =
    `mailto:?subject=${encodedTitle}&body=${encodeURIComponent(pageUrl)}`;
}

loadRecipe();

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
