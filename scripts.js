// Import Supabase client from CDN or npm (if not already imported in your HTML)
// Assuming you include this in your HTML:
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

// Your Supabase project URL and anon key - replace with your actual values
const supabaseUrl = 'https://hyzwpjxcfuuqipyozhvh.supabase.co'; // Replace with your Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5endwanhjZnV1cWlweW96aHZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0MDAyOTYsImV4cCI6MjA2NTk3NjI5Nn0.1Z88yKnjP8_rY23C5qyt_gQIK5Obb6VAzaUMycts1eo'; // Replace with your anon public key
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Function to load recipes from Supabase and render them
async function loadRecipes() {
  try {
    // Fetch all recipes from the "recipes" table
    const { data: recipes, error } = await supabase.from('recipes').select('*');

    if (error) {
      console.error('Error fetching recipes:', error.message);
      return;
    }

    // Log the fetched recipes for debugging
    console.log('Fetched recipes:', recipes);

    // Get the container element where recipes will be displayed
    const container = document.getElementById('recipes-container');
    if (!container) {
      console.error('Container element with id "recipes-container" not found.');
      return;
    }

    // Clear any existing content inside the container
    container.innerHTML = '';

    // Loop through each recipe and create HTML elements to display
    recipes.forEach(recipe => {
      // Create the main card div
      const card = document.createElement('div');
      card.className = 'recipe-card';

      // Create the inner HTML with title, video iframe, and button linking to detail page
      card.innerHTML = `
        <h3>${recipe.title}</h3>
        <iframe src="${recipe.video_url}" frameborder="0" allowfullscreen></iframe>
        <button class="btn-secondary" onclick="window.location.href='recipe.html?id=${recipe.id}'">
          View Recipe
        </button>
      `;

      // Append this card to the container
      container.appendChild(card);
    });
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

// Run loadRecipes once the DOM content is loaded
window.addEventListener('DOMContentLoaded', loadRecipes);
