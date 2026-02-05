document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // HELPER FUNCTIONS
    // ==========================================

    // 1. Creates the "Vibe" Outline (Colored Border around text)
    function getVibeStyle(color) {
        if (!color) return ""; 
        return `text-shadow: 1px 1px 0 ${color}, -1px 1px 0 ${color}, 1px -1px 0 ${color}, -1px -1px 0 ${color};`;
    }

    // 2. Extracts a clean Video ID from ANY YouTube link (Shorts, regular, or dirty links)
    function extractYouTubeID(url) {
        if (!url) return "";
        // Regex looks for exactly 11 characters after 'shorts/', 'v=', or 'youtu.be/'
        const match = url.match(/(?:shorts\/|v=|youtu\.be\/)([\w-]{11})/);
        return match ? match[1] : url; 
    }

    // ==========================================
    // PART 1: HOME PAGE LOGIC (Feature of the Week)
    // ==========================================
    const heroContainer = document.getElementById('treat-name');
    const featuredContainer = document.getElementById('featured-treat-container');
    
    if (typeof currentTreatID !== 'undefined') {
        const featuredTreat = treatData[currentTreatID];
        if (heroContainer) {
        heroContainer.innerText = featuredTreat.name + "";
        }
    if (featuredContainer) {
        
        
        if (featuredTreat) {
            
            // --- 1. PREORDER BUTTON LOGIC ---
            const displayPrice = (typeof currentPrice !== 'undefined') ? currentPrice : "0";

            // --- 2. IMAGE LOGIC ---
            const heroImage = (featuredTreat.images && featuredTreat.images.length > 0) 
                ? featuredTreat.images[0] : null;

            let visualHTML = '';
            const vibeStyle = getVibeStyle(featuredTreat.vibe || '#000');

            if (heroImage) {
                const preorderWrapper = document.getElementById('preorder-wrapper');
                visualHTML = 
                    `<div style="position: relative;">
                        <img src="${heroImage}" alt="${featuredTreat.name}" style="width:100%; height: auto; border-radius:10px; display: block;">
                        <h2 style="position: absolute; bottom: 10px; left: 10px; margin: 0; color: white; font-size: 2rem; ${vibeStyle}">
                            ${featuredTreat.name}
                        </h2>
                        <a style="position: absolute; right: -15px; top: 10px; margin: 0;" href="https://venmo.com/Jaden-Daden?txn=pay&amount=${displayPrice}&note=jaytreat" target="_blank" class="preorder-btn">
                        Click to preorder (${displayPrice.toFixed(2)}$)
                    </a>
                    </div>`;
            } else {
                visualHTML = `<div class="placeholder-img"><span>${featuredTreat.name}</span></div>`;
            }

            // --- 3. VIDEO LOGIC ---
            let rawLink = featuredTreat.youtubeID ? featuredTreat.youtubeID.trim() : "";
            let cleanID = extractYouTubeID(rawLink);
            
            // CHECK: Do we actually have a video ID?
            // (If rawLink is empty, or if cleanID is empty, we have no video)
            const hasVideo = (cleanID && cleanID.length > 0);

            // --- 4. BUILD HTML (Conditional Layout) ---
            
            if (hasVideo) {
                // SCENARIO A: WE HAVE A VIDEO (Standard Layout)
                
                let containerClass = "video-container"; 
                if (rawLink.includes("shorts")) {
                    containerClass += " shorts-mode";
                }
                featuredContainer.innerHTML = 

                    '<div class="content-block">' +
                        '<a href="treat.html?id=' + currentTreatID + '" class="image-link">' +
                            visualHTML + 
                        '</a>' +
                    '</div>' +
                    '<div class="content-block">' +
                        '<div class="' + containerClass + '">' +
                            '<iframe src="https://www.youtube.com/embed/' + cleanID + '?rel=0" frameborder="0" allowfullscreen></iframe>' +
                        '</div>' +
                    '</div>';

            } else {
                // SCENARIO B: NO VIDEO (Center the Image)
                
                // We add inline styles to center the block and limit its width so it doesn't look stretched
                featuredContainer.innerHTML = 
                    '<div class="content-block" style="margin: 0 auto; float: none; max-width: 600px; width: 100%;">' +
                        '<a href="treat.html?id=' + currentTreatID + '" class="image-link">' +
                            visualHTML + 
                        '</a>' +
                    '</div>';
            }

        } else {
            featuredContainer.innerHTML = "<p>Treat data not found for ID: " + currentTreatID + "</p>";
        }
    }
}

// ==========================================
    // PART 2: GALLERY PAGE LOGIC (Full Menu)
    // ==========================================
    const galleryContainer = document.getElementById('full-gallery');
    const searchInput = document.getElementById('treat-search');

    if (galleryContainer) {
        
        // --- LAZY LOADING OBSERVER ---
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    // Move data-src to src
                    img.src = img.dataset.src;
                    // Add a class to trigger CSS fade-in
                    img.classList.add('loaded');
                    // Stop watching this specific image
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '0px 0px 300px 0px' // Load 300px before they appear
        });

        function renderGallery(filterText = "") {
            galleryContainer.innerHTML = "";
            let matchCount = 0; 
            const cleanFilter = filterText.toLowerCase().trim();

            Object.keys(treatData).forEach(function(id) {
                const treat = treatData[id];
                
                if (treat.name.toLowerCase().includes(cleanFilter) || 
                    treat.ingredients.toLowerCase().includes(cleanFilter)) {
                    
                    matchCount++;
                    
                    const cardImage = (treat.images && treat.images.length > 0) ? treat.images[0] : null;
                    
                    // MODIFIED: Use data-src instead of src for the high-res image
                    // We use a tiny transparent gif as the initial src to keep it valid
                    let cardVisual = cardImage 
                        ? `<img class="lazy-load" 
                                src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" 
                                data-src="${cardImage}" 
                                alt="${treat.name}" 
                                style="width:100%; height:auto; border-radius:10px; margin-bottom:15px; display:block; opacity:0; transition: opacity 0.5s ease-in;">`
                        : `<div class="placeholder-img" style="height: 200px; margin-bottom: 15px;"><span>${treat.name}</span></div>`;

                    const vibeStyle = getVibeStyle(treat.vibe || '#000');

                    const cardHTML = 
                        '<div class="content-block animate-in" style="margin-bottom: 40px;">' +
                            '<a href="treat.html?id=' + id + '" class="image-link">' +
                                cardVisual +
                            '</a>' +
                            '<div class="card-text">' +
                                `<h3><a href="treat.html?id=${id}" style="text-decoration: none; color: white; ${vibeStyle}">${treat.name}</a></h3>` +
                            '</div>' +
                        '</div>';
                    
                    galleryContainer.insertAdjacentHTML('beforeend', cardHTML);
                }
            });

            // Start observing the newly created images
            document.querySelectorAll('.lazy-load').forEach(img => imageObserver.observe(img));

            if (matchCount === 0) {
                galleryContainer.innerHTML = '<p style="text-align:center; width:100%;">No treats found matching "' + filterText + '"</p>';
            }
        }

        renderGallery();

        if (searchInput) {
            searchInput.addEventListener('input', (e) => renderGallery(e.target.value));
        }
    }
    
    
});
