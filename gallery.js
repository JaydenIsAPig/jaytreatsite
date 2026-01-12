const featuredContainer = document.getElementById('featured-treat-container');
const galleryContainer = document.getElementById('treat-gallery');
const searchInput = document.getElementById('treat-search');

function loadFeaturedTreat() {
    // 1. Get the data for the current treat
    const featuredTreat = treatData[currentTreatID];

    // 2. Safety Check: Does the treat actually exist?
    if (featuredTreat) {
        // We use string concatenation (+) here to ensure the ID is inserted perfectly
        // Notice: href="treat.html?id=' + currentTreatID + '"
        featuredContainer.innerHTML = 
            '<div class="content-block">' +
                '<a href="treat.html?id=' + currentTreatID + '" class="image-link">' +
                    '<div class="placeholder-img">' +
                        '<span>' + featuredTreat.name + '</span>' +
                    '</div>' +
                '</a>' +
            '</div>' +
            '<div class="content-block">' +
                '<div class="video-container">' +
                    '<iframe src="https://www.youtube.com/embed/' + featuredTreat.youtubeID + '" frameborder="0" allowfullscreen></iframe>' +
                '</div>' +
            '</div>';
    } else {
        featuredContainer.innerHTML = "<p>Error: Could not find treat with ID: " + currentTreatID + "</p>";
    }
}

function renderGallery(filter = "") {
    galleryContainer.innerHTML = ""; // Clear current list

    Object.keys(treatData).forEach(function(id) {
        // Skip the one that is already at the top of the page
        if (id === currentTreatID) return;

        const treat = treatData[id];
        const searchTerm = filter.toLowerCase();

        if (treat.name.toLowerCase().includes(searchTerm) || 
            treat.ingredients.toLowerCase().includes(searchTerm)) {
            
            // Build the gallery card
            const cardHTML = 
                '<div class="content-block animate-in">' +
                    '<a href="treat.html?id=' + id + '" class="image-link">' +
                        '<div class="placeholder-img">' +
                            '<div class="card-text">' +
                                '<h3>' + treat.name + '</h3>' +
                                '<p>View Details</p>' +
                            '</div>' +
                        '</div>' +
                    '</a>' +
                '</div>';
            
            galleryContainer.innerHTML += cardHTML;
        }
    });
}

// Initialize
if (searchInput) {
    searchInput.addEventListener('input', function(e) {
        renderGallery(e.target.value);
    });
}

// Wait for HTML to load before running scripts
document.addEventListener('DOMContentLoaded', function() {
    loadFeaturedTreat();
    renderGallery();
});

document.addEventListener('DOMContentLoaded', () => {

    // --- HOME PAGE LOGIC ---
    const featuredContainer = document.getElementById('featured-treat-container');
    if (featuredContainer && typeof currentTreatID !== 'undefined') {
        const featuredTreat = treatData[currentTreatID];
        if (featuredTreat) {
            featuredContainer.innerHTML = 
                '<div class="content-block">' +
                    '<a href="treat.html?id=' + currentTreatID + '" class="image-link">' +
                        '<div class="placeholder-img"><span>' + featuredTreat.name + '</span></div>' +
                    '</a>' +
                '</div>' +
                '<div class="content-block">' +
                    '<div class="video-container">' +
                        '<iframe src="https://www.youtube.com/embed/' + featuredTreat.youtubeID + '" frameborder="0" allowfullscreen></iframe>' +
                    '</div>' +
                '</div>';
        }
    }

    // --- GALLERY PAGE LOGIC ---
    const galleryContainer = document.getElementById('full-gallery');
    const searchInput = document.getElementById('treat-search');

    if (galleryContainer) {
        
        function renderGallery(filterText = "") {
            // 1. Clear the current gallery
            galleryContainer.innerHTML = "";
            let matchCount = 0; // Track how many items we find

            // 2. Normalize the search text (make it lowercase)
            const cleanFilter = filterText.toLowerCase().trim();

            // 3. Loop through data
            Object.keys(treatData).forEach(function(id) {
                const treat = treatData[id];
                
                // CHECK: Search inside Name AND Ingredients
                if (treat.name.toLowerCase().includes(cleanFilter) || 
                    treat.ingredients.toLowerCase().includes(cleanFilter)) {
                    
                    matchCount++; // We found a match!

                    const cardHTML = 
                        '<div class="content-block animate-in" style="margin-bottom: 40px;">' +
                            '<div class="placeholder-img" style="height: 200px; margin-bottom: 15px;">' +
                                '<span>Treat Visual</span>' +
                            '</div>' +
                            '<div class="card-text">' +
                                '<h3><a href="treat.html?id=' + id + '" style="text-decoration: underline; color: white;">' + treat.name + '</a></h3>' +
                            '</div>' +
                        '</div>';
                    
                    galleryContainer.innerHTML += cardHTML;
                }
            });

            // 4. "No Results" Message
            if (matchCount === 0) {
                galleryContainer.innerHTML = '<p style="text-align:center; width:100%;">No treats found matching "' + filterText + '"</p>';
            }
        }

        // Run once on load to show everything
        renderGallery();

        // Listen for typing
        if (searchInput) {
            searchInput.addEventListener('input', function(e) {
                console.log("Typing detected: " + e.target.value); // Debugging line
                renderGallery(e.target.value);
            });
        } else {
            console.error("Javascript cannot find the element with id 'treat-search'");
        }
    }
});