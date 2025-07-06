import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Supabase credentials

const supabaseUrl = 'https://ozdwocrbrojtyogolqxn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96ZHdvY3Jicm9qdHlvZ29scXhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NzE5MzMsImV4cCI6MjA2NjE0NzkzM30.-MAiUtrdza-T2q8POxY-ZcZuZr5QYzFYq5yd-bVYzRQ'; // Replace with your actual anon key
const supabase = createClient(supabaseUrl, supabaseKey);


// Fetch and render equipment
async function fetchEquipment() {
  const equipmentContainer = document.getElementById('equipment-container');

  const { data: equipment, error } = await supabase
    .from('equipment_db')
    .select('*');

  if (error) {
    equipmentContainer.innerHTML = `<p>Error loading equipment.</p>`;
    console.error(error);
    return;
  }

  if (!equipment || equipment.length === 0) {
    equipmentContainer.innerHTML = `<p>No equipment found.</p>`;
    return;
  }

  // Render each equipment card
equipmentContainer.innerHTML += `
  <div class="equipment-item">
    <img class="equipment-image" src="${item.image_url}" alt="${item.title}" />
    <h3 class="equipment-title">${item.name}</h3>
    <p class="equipment-description">${item.description || ''}</p>
    <a class="btn-buy" href="${item.affiliate_link}" target="_blank" rel="noopener noreferrer">
      Buy Now
    </a>
  </div>
`;

    `;
  });
}

fetchEquipment();
