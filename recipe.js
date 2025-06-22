// recipe.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://ozdwocrbrojtyogolqxn.supabase.co'; // your Supabase project URL
const SUPABASE_ANON_KEY = 'your-anon-key-here'; // replace with your anon key

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const urlParams = new URLSearchParams(window.location.search);
const slug = urlParams.get('slug');

const titleEl = document.getElementById('recipe-title');
const descEl = document.getElementById('recipe-description');
const ingredientsList = document.getElementById('ingredients-list');
const methodList = document.getElementById('method-list');
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

  // Populate fields
  titleEl.textContent = data.title;
  descEl.textContent = data.description || '';

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

  // Video
  videoFrame.src = data.video_url || '';
  videoFrame.title = data.title;
}

loadRecipe();
