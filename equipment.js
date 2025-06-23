// equipment.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Supabase config
const SUPABASE_URL = 'https://ozdwocrbrojtyogolqxn.supabase.co'; // Replace with your Supabase URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96ZHdvY3Jicm9qdHlvZ29scXhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NzE5MzMsImV4cCI6MjA2NjE0NzkzM30.-MAiUtrdza-T2q8POxY-ZcZuZr5QYzFYq5yd-bVYzRQ'; // Replace with your Supabase anon key

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// DOM element to render equipment
const equipmentContainer = document.getElementById('equipment-container');

// Load equipment
async function loadEquipment() {
  const { data, error } = await supabase
    .from('equipment_db')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    equipmentContainer.innerHTML = `<p>Error loading equipment.</p>`;
    console.error('Error:', error);
    return;
  }

  if (!data || data.length === 0) {
    equipmentContainer.innerHTML = `<p>No kitchen equipment found.</p>`;
    return;
  }

  // Render each equipment item
  equipmentContainer.innerHTML = data.map(item => `
    <div class="equipment-card">
      <img src="${item.image_url}" alt="${item.name}" />
      <h3>${item.name}</h3>
      <p>${item.description}</p>
      <a href="${item.affiliate_link}" class="buy-btn" target="_blank">Buy on Amazon</a>
    </div>
  `).join('');
}

loadEquipment();
