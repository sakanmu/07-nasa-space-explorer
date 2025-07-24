// Fetch and display NASA images
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');
const gallery = document.getElementById('gallery');
const getImagesBtn = document.querySelector('button');

setupDateInputs(startInput, endInput);

// Your NASA API key here (or use DEMO_KEY if testing)
const API_KEY = 'dxV3TNt2qtMJVrQC4ozXi2v7VNrHUMaWFYvAISSQ'; // Replace with your actual key

getImagesBtn.addEventListener('click', () => {
  const startDate = startInput.value;
  const endDate = endInput.value;

  if (startDate && endDate) {
    fetchImages(startDate, endDate);
  }
});

async function fetchImages(startDate, endDate) {
  gallery.innerHTML = '<p class="loading">🔄 Loading space photos…</p>';

  const url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&start_date=${startDate}&end_date=${endDate}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    displayGallery(data);
  } catch (err) {
    gallery.innerHTML = '<p class="error">🚫 Failed to load images. Please try again.</p>';
    console.error(err);
  }
}

function displayGallery(images) {
  gallery.innerHTML = ''; // Clear previous content

  images
    .filter(item => item.media_type === 'image') // Skip videos
    .reverse() // Show most recent first
    .forEach(item => {
      const div = document.createElement('div');
      div.className = 'gallery-item';
      div.innerHTML = `
        <img src="${item.url}" alt="${item.title}" />
        <p><strong>${item.title}</strong><br>${item.date}</p>
      `;
      div.addEventListener('click', () => showModal(item));
      gallery.appendChild(div);
    });
}

function showModal(item) {
  // Create modal elements
  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'modal-overlay';
  modalOverlay.innerHTML = `
    <div class="modal">
      <span class="close-modal">&times;</span>
      <img src="${item.hdurl || item.url}" alt="${item.title}" />
      <h2>${item.title}</h2>
      <p><em>${item.date}</em></p>
      <p>${item.explanation}</p>
    </div>
  `;
  document.body.appendChild(modalOverlay);

  // Close on click
  modalOverlay.querySelector('.close-modal').addEventListener('click', () => {
    modalOverlay.remove();
  });

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) modalOverlay.remove();
  });
}

