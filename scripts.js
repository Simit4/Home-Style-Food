// scripts.js

// Initialize Supabase client with your URL and anon key
const supabaseUrl = 'https://hyzwpjxcfuuqipyozhvh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5endwanhjZnV1cWlweW96aHZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0MDAyOTYsImV4cCI6MjA2NTk3NjI5Nn0.1Z88yKnjP8_rY23C5qyt_gQIK5Obb6VAzaUMycts1eo';
// Supabase setup

const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Get current page
const path = window.location.pathname;

// Render all recipes on recipes.html
if (path.includes("recipes.html")) {
  fetchAndDisplayRecipes();
}

// Render single recipe on recipe.html
if (path.includes("recipe.html")) {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");
  if (slug) {
    fetchSingleRecipe(slug);
  }
}

// Get all recipes from Supabase
async function fetchAndDisplayRecipes() {
  const { data, error } = await supabase.from("recipe_db").select("*");
  if (error) {
    console.error("Error fetching recipes:", error.message);
    return;
  }

  const container = document.getElementById("recipes-container");
  if (!container) return;

  container.innerHTML = "";

  data.forEach((recipe) => {
    const card = document.createElement("div");
    card.className = "recipe-card";

    card.innerHTML = `
      <iframe src="${recipe.video_url}" allowfullscreen></iframe>
      <h3>${recipe.title}</h3>
      <p>${recipe.description || ""}</p>
      <a class="btn-secondary" href="recipe.html?slug=${recipe.slug}">View Recipe</a>
    `;

    container.appendChild(card);
  });
}

// Get single recipe from Supabase
async function fetchSingleRecipe(slug) {
  const { data, error } = await supabase
    .from("recipe_db")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching recipe:", error.message);
    return;
  }

  const container = document.getElementById("recipe-content");
  if (!container) return;

  container.innerHTML = `
    <h2 class="recipe-title">${data.title}</h2>
    <p class="recipe-subtitle">${data.description || ""}</p>
    <div class="recipe-layout

