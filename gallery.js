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
    // ==========================================
    // PART 1: HOME PAGE LOGIC (Feature of the Week)
    // ==========================================
    const featuredContainer = document.getElementById('featured-treat-container');
    
    if (featuredContainer && typeof currentTreatID !== 'undefined') {
        const featuredTreat = treatData[currentTreatID];
        
        if (featuredTreat) {
            
            // --- 1. PREORDER BUTTON LOGIC ---
            const preorderWrapper = document.getElementById('preorder-wrapper');
            // Use the GLOBAL variable from treats.js
            const displayPrice = (typeof currentPrice !== 'undefined') ? currentPrice : "0";

            if (preorderWrapper) {
                preorderWrapper.innerHTML = `
                    <a href="https://venmo.com/Jaden-Daden?txn=pay&amount=${displayPrice}&note=jaytreat" target="_blank" class="preorder-btn">
                        Preorder Now ($${displayPrice})
                    </a>
                `;
            }

            // --- 2. IMAGE LOGIC ---
            const heroImage = (featuredTreat.images && featuredTreat.images.length > 0) 
                ? featuredTreat.images[0] : null;

            let visualHTML = '';
            const vibeStyle = getVibeStyle(featuredTreat.vibe || '#000');

            if (heroImage) {
                visualHTML = 
                    `<div style="position: relative;">
                        <img src="${heroImage}" alt="${featuredTreat.name}" style="width:100%; height: auto; border-radius:10px; display: block;">
                        <h2 style="position: absolute; bottom: 10px; left: 10px; margin: 0; color: white; font-size: 2rem; ${vibeStyle}">
                            ${featuredTreat.name}
                        </h2>
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

    // ==========================================
    // PART 2: GALLERY PAGE LOGIC (Full Menu)
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
                
                // Search Filter Logic
                if (treat.name.toLowerCase().includes(cleanFilter) || 
                    treat.ingredients.toLowerCase().includes(cleanFilter)) {
                    
                    matchCount++;
                    
                    // Image Logic
                    const cardImage = (treat.images && treat.images.length > 0) ? treat.images[0] : null;
                    let cardVisual = cardImage 
                        ? `<img src="${cardImage}" alt="${treat.name}" style="width:100%; height:auto; border-radius:10px; margin-bottom:15px; display:block;">`
                        : `<div class="placeholder-img" style="height: 200px; margin-bottom: 15px;"><span>${treat.name}</span></div>`;

                    // Vibe Text Logic
                    const vibeStyle = getVibeStyle(treat.vibe || '#000');

                    const cardHTML = 
                        '<div class="content-block animate-in" style="margin-bottom: 40px;">' +
                            '<a href="treat.html?id=' + id + '" class="image-link">' +
                                cardVisual +
                            '</a>' +
                            '<div class="card-text">' +
                                // Title with Vibe Outline (No Underline)
                                `<h3><a href="treat.html?id=${id}" style="text-decoration: none; color: white; ${vibeStyle}">${treat.name}</a></h3>` +
                            '</div>' +
                        '</div>';
                    
                    galleryContainer.innerHTML += cardHTML;
                }
            });
            

            if (matchCount === 0) {
                galleryContainer.innerHTML = '<p style="text-align:center; width:100%;">No treats found matching "' + filterText + '"</p>';
            }
        }
        

        // Run once on load
        renderGallery();

        // Listen for typing in search bar
        if (searchInput) {
            searchInput.addEventListener('input', (e) => renderGallery(e.target.value));
        }
    }
    
    
});
