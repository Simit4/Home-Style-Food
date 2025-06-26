import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabase = createClient(
  'https://ozdwocrbrojtyogolqxn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96ZHdvY3Jicm9qdHlvZ29scXhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NzE5MzMsImV4cCI6MjA2NjE0NzkzM30.-MAiUtrdza-T2q8POxY-ZcZuZr5QYzFYq5yd-bVYzRQ'
)

const slug = new URLSearchParams(window.location.search).get('slug')

async function loadRecipe() {
  if (!slug) return

  const { data, error } = await supabase
    .from('recipe_db')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Error loading recipe:', error)
    return
  }

  document.getElementById('recipe-title').textContent = data.title
  document.getElementById('recipe-description').textContent = data.description || ''
  document.getElementById('prep-time').textContent = data.prep_time || '-'
  document.getElementById('cook-time').textContent = data.cook_time || '-'
  document.getElementById('servings').textContent = data.servings || '-'
  document.getElementById('nutrition').textContent = data.nutritional_info || '-'
  document.getElementById('notes').textContent = data.notes || '-'
  document.getElementById('facts').textContent = data.facts || '-'
  document.getElementById('tags').textContent = Array.isArray(data.tags) ? data.tags.join(', ') : '-'

  const ingredientsList = document.getElementById('recipe-ingredients')
  const methodList = document.getElementById('recipe-method')
  ingredientsList.innerHTML = ''
  methodList.innerHTML = ''

  data.ingredients?.forEach(item => {
    const li = document.createElement('li')
    li.textContent = item
    ingredientsList.appendChild(li)
  })

  data.method?.forEach(step => {
    const li = document.createElement('li')
    li.textContent = step
    methodList.appendChild(li)
  })

  const video = document.getElementById('recipe-video')
  video.src = data.video_url || ''
  video.title = data.title
}

loadRecipe()

