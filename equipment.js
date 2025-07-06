

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://ozdwocrbrojtyogolqxn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96ZHdvY3Jicm9qdHlvZ29scXhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NzE5MzMsImV4cCI6MjA2NjE0NzkzM30.-MAiUtrdza-T2q8POxY-ZcZuZr5QYzFYq5yd-bVYzRQ'; // Replace with your actual anon key
const supabase = createClient(supabaseUrl, supabaseKey);


// Default fallback image (in case an item has no image)
const fallbackImage = 'https://via.placeholder.com/300x200.png?text=No+Image';

async function fetchEquipment() {
  try {
    const { data: equipment, error } = await supabase
      .from('equipment_db')
      .select('*')
      .order('title', { ascending: true });

    if (error || !equipment) throw error;
    renderEquipment(equipment);
  } catch (err) {
    console.error('Error loading equipment:', err.message || err);
    document.getElementById('equipment-container').innerHTML = `<p style="color:red;">Unable to load equipment. Please try again later.</p>`;
  }
}

function renderEquipment(items) {
  const container = document.getElementById('equipment-container');
  container.innerHTML = '';

  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'equipment-item';

    card.innerHTML = `
      <img src="${item.image_url || fallbackImage}" alt="${item.title}" class="equipment-image" />
      <h3 class="equipment-title">${item.title}</h3>
      <a href="${item.link}" class="btn-buy" target="_blank" rel="noopener noreferrer">
        Buy on Amazon
      </a>
    `;

    container.appendChild(card);
  });
}

fetchEquipment();
