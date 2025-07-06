import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Supabase credentials

const supabaseUrl = 'https://ozdwocrbrojtyogolqxn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96ZHdvY3Jicm9qdHlvZ29scXhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NzE5MzMsImV4cCI6MjA2NjE0NzkzM30.-MAiUtrdza-T2q8POxY-ZcZuZr5QYzFYq5yd-bVYzRQ'; // Replace with your actual anon key
const supabase = createClient(supabaseUrl, supabaseKey);


const equipmentContainer = document.getElementById('equipment-container');

async function fetchEquipment() {
  const { data, error } = await supabase
    .from('equipment_db')
    .select('*');

  if (error) {
    console.error('Error loading equipment:', error.message);
    equipmentContainer.innerHTML = '<p>Error loading equipment.</p>';
    return;
  }

  if (!data.length) {
    equipmentContainer.innerHTML = '<p>No equipment items found.</p>';
    return;
  }

  equipmentContainer.innerHTML = ''; // Clear container

  data.forEach(item => {
    equipmentContainer.innerHTML += `
      <div class="equipment-item">
        <img class="equipment-image" src="${item.image_url}" alt="${item.name}" />
        <h3 class="equipment-title">${item.name}</h3>
        <p class="equipment-description">${item.description || ''}</p>
        <a class="btn-buy" href="${item.affiliate_link}" target="_blank" rel="noopener noreferrer">
          Buy Now
        </a>
      </div>
    `;
  });
}

fetchEquipment();
