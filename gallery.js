const featuredContainer = document.getElementById("featured-treat-container");
const galleryContainer = document.getElementById("treat-gallery");
const searchInput = document.getElementById("treat-search");

function loadFeaturedTreat() {
  // 1. Get the data for the current treat
  const featuredTreat = treatData[currentTreatID];

  // 2. Safety Check: Does the treat actually exist?
  if (featuredTreat) {
    // We use string concatenation (+) here to ensure the ID is inserted perfectly
    // Notice: href="treat.html?id=' + currentTreatID + '"
    featuredContainer.innerHTML =
      '<div class="content-block">' +
      '<a href="treat.html?id=' +
      currentTreatID +
      '" class="image-link">' +
      '<div class="placeholder-img">' +
      "<span>" +
      featuredTreat.name +
      "</span>" +
      "</div>" +
      "</a>" +
      "</div>" +
      '<div class="content-block">' +
      '<div class="video-container">' +
      '<iframe src="https://www.youtube.com/embed/' +
      featuredTreat.youtubeID +
      '" frameborder="0" allowfullscreen></iframe>' +
      "</div>" +
      "</div>";
  } else {
    featuredContainer.innerHTML =
      "<p>Error: Could not find treat with ID: " + currentTreatID + "</p>";
  }
}

function renderGallery(filter = "") {
  galleryContainer.innerHTML = ""; // Clear current list

  Object.keys(treatData).forEach(function (id) {
    // Skip the one that is already at the top of the page
    if (id === currentTreatID) return;

    const treat = treatData[id];
    const searchTerm = filter.toLowerCase();

    if (
      treat.name.toLowerCase().includes(searchTerm) ||
      treat.ingredients.toLowerCase().includes(searchTerm)
    ) {
      // Build the gallery card
      const cardHTML =
        '<div class="content-block animate-in">' +
        '<a href="treat.html?id=' +
        id +
        '" class="image-link">' +
        '<div class="placeholder-img">' +
        '<div class="card-text">' +
        "<h3>" +
        treat.name +
        "</h3>" +
        "<p>View Details</p>" +
        "</div>" +
        "</div>" +
        "</a>" +
        "</div>";

      galleryContainer.innerHTML += cardHTML;
    }
  });
}

// Initialize
if (searchInput) {
  searchInput.addEventListener("input", function (e) {
    renderGallery(e.target.value);
  });
}

// Wait for HTML to load before running scripts
document.addEventListener("DOMContentLoaded", function () {
  loadFeaturedTreat();
  renderGallery();
});

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // PART 1: HOME PAGE LOGIC (Feature of the Week)
    // ==========================================
    const featuredContainer = document.getElementById('featured-treat-container');
    
    // We check if the container exists AND if 'currentTreatID' is set in treats.js
    if (featuredContainer && typeof currentTreatID !== 'undefined') {
        const featuredTreat = treatData[currentTreatID];
        
        if (featuredTreat) {
            // 1. GET THE IMAGE
            // Check if images exist in the array, otherwise use a default/placeholder
            const heroImage = (featuredTreat.images && featuredTreat.images.length > 0) 
                ? featuredTreat.images[0] 
                : null;

            // 2. BUILD THE HTML
            // If we have an image, make an <img> tag. If not, make a text box.
            let visualHTML = '';
            
            if (heroImage) {
                visualHTML = '<img src="' + heroImage + '" alt="' + featuredTreat.name + '" style="width:100%; height: auto; border-radius:10px; object-fit: cover; display: block;">';
            } else {
                // Fallback to the old placeholder box if no image is found
                visualHTML = '<div class="placeholder-img"><span>' + featuredTreat.name + '</span></div>';
            }

            featuredContainer.innerHTML = 
                '<div class="content-block">' +
                    '<a href="treat.html?id=' + currentTreatID + '" class="image-link">' +
                        visualHTML + // This inserts the IMAGE or the BOX
                    '</a>' +
                '</div>' +
                '<div class="content-block">' +
                    '<div class="video-container">' +
                        '<iframe src="https://www.youtube.com/embed/' + featuredTreat.youtubeID + '" frameborder="0" allowfullscreen></iframe>' +
                    '</div>' +
                '</div>';
        }
    }

    // ==========================================
    // PART 2: GALLERY PAGE LOGIC (The Full List)
    // ==========================================
    const galleryContainer = document.getElementById('full-gallery');
    const searchInput = document.getElementById('treat-search');

    if (galleryContainer) {
        
        function renderGallery(filterText = "") {
            galleryContainer.innerHTML = "";
            let matchCount = 0; 
            const cleanFilter = filterText.toLowerCase().trim();

            Object.keys(treatData).forEach(function(id) {
                const treat = treatData[id];
                
                // Search Filter
                if (treat.name.toLowerCase().includes(cleanFilter) || 
                    treat.ingredients.toLowerCase().includes(cleanFilter)) {
                    
                    matchCount++;

                    // Get the Main Image for the gallery card
                    const cardImage = (treat.images && treat.images.length > 0) 
                        ? treat.images[0] 
                        : null;

                    // ... inside renderGallery loop ...

let cardVisual = '';
if (cardImage) {
    // OLD CODE: height: 200px; object-fit: cover;
    // NEW CODE: height: auto; (Removes cropping, keeps aspect ratio)
    cardVisual = '<img src="' + cardImage + '" alt="' + treat.name + '" style="width:100%; height:auto; border-radius:10px; margin-bottom:15px; display:block;">';
} else {
    // Placeholders still benefit from a fixed height since they have no image to size them
    cardVisual = '<div class="placeholder-img" style="height: 200px; margin-bottom: 15px;"><span>' + treat.name + '</span></div>';
}

// ... rest of code

                    const cardHTML = 
                        '<div class="content-block animate-in" style="margin-bottom: 40px;">' +
                            // LINKED IMAGE
                            '<a href="treat.html?id=' + id + '" class="image-link">' +
                                cardVisual +
                            '</a>' +
                            // LINKED TEXT
                            '<div class="card-text">' +
                                '<h3><a href="treat.html?id=' + id + '" style="text-decoration: underline; color: white;">' + treat.name + '</a></h3>' +
                            '</div>' +
                        '</div>';
                    
                    galleryContainer.innerHTML += cardHTML;
                }
            });

            if (matchCount === 0) {
                galleryContainer.innerHTML = '<p style="text-align:center; width:100%;">No treats found matching "' + filterText + '"</p>';
            }
        }

        renderGallery();

        if (searchInput) {
            searchInput.addEventListener('input', function(e) {
                renderGallery(e.target.value);
            });
        }
    }
});
