// equipment.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Supabase config
const SUPABASE_URL = 'https://ozdwocrbrojtyogolqxn.supabase.co'; // Replace with your Supabase URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96ZHdvY3Jicm9qdHlvZ29scXhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NzE5MzMsImV4cCI6MjA2NjE0NzkzM30.-MAiUtrdza-T2q8POxY-ZcZuZr5QYzFYq5yd-bVYzRQ'; // Replace with your Supabase anon key



const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const equipmentList = document.getElementById('equipment-list');

async function loadEquipment() {
  const { data, error } = await supabase.from('equipment').select('*'); // Make sure your table name is 'equipment'

  if (error) {
    console.error('Error fetching equipment:', error);
    equipmentList.innerHTML = '<p>Failed to load equipment. Please try again later.</p>';
    return;
  }

  if (!data || data.length === 0) {
    equipmentList.innerHTML = '<p>No equipment found.</p>';
    return;
  }

  equipmentList.innerHTML = ''; // Clear container

  data.forEach(item => {
    // Create equipment card
    const div = document.createElement('div');
    div.className = 'equipment-item';

    div.innerHTML = `
      <img src="${item.image_url}" alt="${item.name}" class="equipment-image" />
      <h3 class="equipment-name">${item.name}</h3>
      <p class="equipment-description">${item.description}</p>
      <a href="${item.affiliate_link}" target="_blank" rel="noopener noreferrer" class="btn-buy">Buy on Amazon</a>
    `;

    equipmentList.appendChild(div);
  });
}

loadEquipment();

