const SUPABASE_URL = 'https://hyzwpjxcfuuqipyozhvh.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY'; // replace with your anon key

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function getRecipeIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

async function loadRecipe() {
  const id = getRecipeIdFromURL();
  if (!id) {
    document.getElementById('recipe-title').textContent = 'Recipe ID not found in URL';
    return;
  }

  const { data, error } = await supabase
    .from('recipe-db')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching recipe:', error);
    document.getElementById('recipe-title').textContent = 'Error loading recipe';
    return;
  }

  if (!data) {
    document.getElementById('recipe-title').textContent = 'Recipe not found';
    return;
  }

  // Set title & subtitle
  document.getElementById('recipe-title').textContent = data.title;
  document.getElementById('recipe-subtitle').textContent = data.description || '';

  // Set video
  document.getElementById('recipe-video').src = data.video;

  // Ingredients list
  const ingList = document.getElementById('ingredients-list');
  ingList.innerHTML = '';
  if (data.ingredients && Array.isArray(data.ingredients)) {
    data.ingredients.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      ingList.appendChild(li);
    });
  }

  // Method list
  const methodList = document.getElementById('method-list');
  methodList.innerHTML = '';
  if (data.method && Array.isArray(data.method)) {
    data.method.forEach(step => {
      const li = document.createElement('li');
      li.textContent = step;
      methodList.appendChild(li);
    });
  }
}

document.addEventListener('DOMContentLoaded', loadRecipe);
