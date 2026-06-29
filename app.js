// Browser fallback for process.env to prevent ReferenceError at runtime
if (typeof process === 'undefined') {
    window.process = {
        env: {
            NEXT_PUBLIC_SUPABASE_URL: '',
            NEXT_PUBLIC_SUPABASE_ANON_KEY: ''
        }
    };
}

// Supabase connection configuration using environment variables or fallbacks
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 
                     (typeof window !== 'undefined' && window.NEXT_PUBLIC_SUPABASE_URL) || 
                     'https://qzkwkiksdyfovxtdyody.supabase.co';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
                     (typeof window !== 'undefined' && window.NEXT_PUBLIC_SUPABASE_ANON_KEY) || 
                     'sb_publishable_nq4oJ6A-My-tL2ZOb3Facg_zzC_EAuE';

// Create Supabase client from global library object safely avoiding shadowing issues
const supabase = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;


/* Fududeeye Somali Property & Household Marketplace Super App - Application Controller */

// Global Application State
let appState = {
    isLoggedIn: false,
    currentUser: {
        id: "user-1",
        full_name: localStorage.getItem('userName') || "Mohamed Farhan",
        phone_number: localStorage.getItem('userPhone') || "+252 666773728",
        avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
        role: "AGENT",
        is_verified: true,
        whatsapp_linked: true,
        trust_rating: 92, // T score
        active_count: 3,
        sold_count: 5
    },
    currentTab: "home",
    selectedPill: "ALL",
    currentLocation: "Bosaso, Puntland",
    favorites: [], // Array of listing IDs
    activeDetailListing: null,
    activeDetailImageIndex: 0,
    activeChatThreadId: null,
    activeUSSDListingId: null,
    selectedTelecomNetwork: "Hormuud",
    attachedPhotos: [], // Base64 or mock URLs
    
    // Filter State
    filters: {
        location: "",
        context: "ALL",
        minPrice: null,
        maxPrice: null,
        propertyType: "",
        beds: "any",
        searchQuery: ""
    }
};

// Mock Database (Restored from backup, will be updated dynamically with Supabase properties)
const MOCK_DB = {
    listings: [
        {
            id: "list-1",
            user_id: "user-2",
            user_name: "Farah Hashi",
            user_avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80",
            user_role: "Verified Broker",
            user_trust: 85,
            category: "SALE",
            title: "Modern 5 Bedroom Luxury Villa",
            description: "A gorgeous modern custom-built villa in a premium neighbourhood of Bosaso. High security, close to markets, features marble flooring, landscaped garden, private parking, and integrated water reservation system. Perfect for families looking for ready-to-move prestige housing.",
            price: 450000,
            location_name: "Bosaso, Puntland",
            address_notes: "Near Star Hotel, Wadajir District",
            images: ["assets/modern_villa.png"],
            status: "ACTIVE",
            views_count: 342,
            property_type: "HOUSE",
            bedrooms: 5,
            bathrooms: 4,
            area_sqm: 320,
            has_water: true,
            has_electricity: true,
            has_security: true,
            has_parking: true,
            is_furnished: false,
            badge: "NEW LISTING",
            created_at: "2026-06-10T12:00:00Z"
        },
        {
            id: "list-2",
            user_id: "user-3",
            user_name: "Sahra Yusuf",
            user_avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80",
            user_role: "Verified Agent",
            user_trust: 90,
            category: "RENT",
            title: "Luxury Seafront 3 Bedroom Penthouse",
            description: "Breathtaking ocean views from this premium penthouse high-rise tower. Experience cool breeze, 24/7 solar backing power, security guards, high speed elevator, and fully furnished master bedrooms. Directly opposite the main coastal walkway.",
            price: 1200,
            location_name: "Bosaso, Puntland",
            address_notes: "Marina Road, Port Sector",
            images: ["assets/seafront_tower.png"],
            status: "ACTIVE",
            views_count: 512,
            property_type: "APARTMENT",
            bedrooms: 3,
            bathrooms: 2.5,
            area_sqm: 160,
            has_water: true,
            has_electricity: true,
            has_security: true,
            has_parking: true,
            is_furnished: true,
            badge: "HOT DEAL",
            created_at: "2026-06-12T15:30:00Z"
        },
        {
            id: "list-3",
            user_id: "user-4",
            user_name: "Warsame Dilaal",
            user_avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80",
            user_role: "Broker",
            user_trust: 76,
            category: "SALE",
            title: "Prime Agricultural Farmland Plot",
            description: "High quality farming land located on the outskirts of Bosaso. Fertile soil suitable for date palms, citrus fruits, and vegetable farming. Has deep well access. Clean deed register papers ready for immediate title transfer.",
            price: 85000,
            location_name: "Bosaso, Puntland",
            address_notes: "Galgala Valley Access Road",
            images: ["assets/farmland_plot.png"],
            status: "ACTIVE",
            views_count: 129,
            property_type: "LAND",
            bedrooms: null,
            bathrooms: null,
            area_sqm: 10000,
            has_water: true,
            has_electricity: false,
            has_security: false,
            has_parking: true,
            is_furnished: false,
            badge: "HOT DEAL",
            created_at: "2026-06-15T09:00:00Z"
        },
        {
            id: "list-4",
            user_id: "user-5",
            user_name: "Khadra Elmi",
            user_avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&h=100&q=80",
            user_role: "Standard User",
            user_trust: 82,
            category: "ITEM",
            title: "Premium Living Room Grey & Orange Sofa Set",
            description: "Super comfortable modular fabric sofa set. Modern colors matching any living room design. Includes one 3-seater, two single armchairs, and matching slate-colored throw pillows. Very minor wear, under 1 year old.",
            price: 350,
            location_name: "Hargeisa, Maroodi Jeex",
            address_notes: "Near Jigjiga Yar, Section 4",
            images: ["assets/luxury_sofa.png"],
            status: "ACTIVE",
            views_count: 88,
            item_condition: "LIKE_NEW",
            item_brand: "HomeDeco",
            created_at: "2026-06-16T10:00:00Z"
        },
        {
            id: "list-5",
            user_id: "user-6",
            user_name: "Mohamed Farah",
            user_avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100&q=80",
            user_role: "Standard User",
            user_trust: 79,
            category: "ITEM",
            title: "Sleek Double-Door Smart Refrigerator",
            description: "Smart refrigerator with digital inverter technology. Saves energy, dual cooling, stainless steel finish, built-in water dispenser. Selling because of moving abroad. 100% operational condition.",
            price: 150,
            location_name: "Mogadishu, Banadir",
            address_notes: "Wadajir, near airport gate 2",
            images: ["assets/smart_refrigerator.png"],
            status: "ACTIVE",
            views_count: 215,
            item_condition: "USED",
            item_brand: "Samsung",
            created_at: "2026-06-17T08:00:00Z"
        }
    ],
    chats: [
        {
            id: "chat-1",
            agent_id: "user-2",
            agent_name: "Farah Hashi",
            agent_avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80",
            agent_phone: "+252 90 779 4321",
            agent_whatsapp: "252907794321",
            listing_title: "Modern 5 Bedroom Luxury Villa",
            messages: [
                { sender: "agent", text: "Asc, cellaan kugu soo dhawoow! Are you interested in viewing the Modern Luxury Villa in Bosaso?", time: "10:15 AM" },
                { sender: "user", text: "Waalaykum Salaam, yes! I wanted to know if the price of $450,000 is negotiable and what the water availability is like.", time: "10:20 AM" },
                { sender: "agent", text: "The water is linked to both town supply and a deep tank, so it never cuts out. The owner is open to reasonable offers.", time: "10:22 AM" }
            ]
        }
    ]
};

// Fetch all properties from Supabase 'properties' table
async function fetchProperties() {
    if (!supabase) {
        console.warn("Supabase client is not initialized.");
        return [];
    }
    try {
        const { data: properties, error } = await supabase
            .from('properties')
            .select('*');

        if (error) {
            console.error('An error occurred while fetching properties:', error.message);
            return [];
        }
        return properties;
    } catch (e) {
        console.error('Unexpected error fetching properties:', e);
        return [];
    }
}

// Map database property layout to local listing model
function mapSupabasePropertyToListing(prop) {
    let images = ["assets/modern_villa.png"]; // default image fallback
    if (prop.images) {
        if (Array.isArray(prop.images)) {
            images = prop.images;
        } else if (typeof prop.images === 'string') {
            try {
                if (prop.images.trim().startsWith('[')) {
                    images = JSON.parse(prop.images);
                } else {
                    images = prop.images.split(',').map(s => s.trim());
                }
            } catch (e) {
                images = [prop.images];
            }
        }
    } else if (prop.image_url) {
        images = [prop.image_url];
    } else if (prop.image) {
        images = [prop.image];
    }

    return {
        id: prop.id ? String(prop.id) : `db-${Math.random()}`,
        user_id: prop.user_id || "user-db",
        user_name: prop.user_name || prop.agent_name || "Agent",
        user_avatar: prop.user_avatar || prop.agent_avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80",
        user_role: prop.user_role || prop.agent_role || "Verified Broker",
        user_trust: prop.user_trust || prop.agent_trust || 85,
        category: prop.category || "RENT", // SALE or RENT
        title: prop.title || "Untitled Property",
        description: prop.description || "No description provided.",
        price: prop.price || 0,
        location_name: prop.location_name || prop.location || "Bosaso, Puntland",
        address_notes: prop.address_notes || prop.address || "",
        images: images,
        status: prop.status || "ACTIVE",
        views_count: prop.views_count || prop.views || 0,
        property_type: prop.property_type || "HOUSE",
        bedrooms: prop.bedrooms !== undefined ? prop.bedrooms : (prop.beds !== undefined ? prop.beds : 0),
        bathrooms: prop.bathrooms !== undefined ? prop.bathrooms : (prop.baths !== undefined ? prop.baths : 0),
        area_sqm: prop.area_sqm !== undefined ? prop.area_sqm : (prop.area !== undefined ? prop.area : 0),
        has_water: prop.has_water !== undefined ? prop.has_water : true,
        has_electricity: prop.has_electricity !== undefined ? prop.has_electricity : true,
        has_security: prop.has_security !== undefined ? prop.has_security : true,
        has_parking: prop.has_parking !== undefined ? prop.has_parking : true,
        is_furnished: prop.is_furnished !== undefined ? prop.is_furnished : false,
        badge: prop.badge || "",
        created_at: prop.created_at || new Date().toISOString()
    };
}

// Fetch from Supabase and dynamically replace hardcoded listings
async function initSupabaseData() {
    const dbProperties = await fetchProperties();
    if (dbProperties && dbProperties.length > 0) {
        // Map to format
        const mappedProperties = dbProperties.map(mapSupabasePropertyToListing);
        
        // Remove hardcoded properties (RENT/SALE) but keep ITEM listings
        MOCK_DB.listings = MOCK_DB.listings.filter(listing => listing.category === "ITEM");
        
        // Combine them
        MOCK_DB.listings = [...mappedProperties, ...MOCK_DB.listings];
    } else {
        console.warn("No properties fetched from Supabase, or failed to connect. Keeping mock data.");
    }
}

// Safe icon generator wrapper preventing CDN block issues
function safeCreateIcons() {
    try {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    } catch (e) {
        console.warn("Lucide icons failed to load:", e);
    }
}

// Guest entry directly bypassing login screen
function getStarted() {
    appState.isLoggedIn = true;
    document.getElementById("splash-screen").classList.remove("active");
    document.getElementById("app-wrapper").classList.add("active");
    updateDashboardView();
    showToast("Ku soo dhawoow Fududeeye! (Welcome to Fududeeye)");
}

// Initialize Application
document.addEventListener("DOMContentLoaded", async () => {
    // Generate icons
    safeCreateIcons();
    
    // Check if user is logged in (mocked)
    checkAuthStatus();
    
    // Bind General Events
    bindAppEvents();
    
    // Initialize properties from Supabase dynamically
    await initSupabaseData();
    
    // Populate cards
    renderFeaturedListings();
});

// Mock Auth Verification
function checkAuthStatus() {
    // If not logged in, splash screen remains active.
    // If logged in, we transition to app wrapper.
    if (appState.isLoggedIn) {
        document.getElementById("splash-screen").classList.remove("active");
        document.getElementById("app-wrapper").classList.add("active");
        updateDashboardView();
    }
}

// Onboarding Carousel Slide Controller
let activeSlideIndex = 0;
function setSplashSlide(index) {
    const slides = document.querySelectorAll(".splash-slide");
    const dots = document.querySelectorAll(".splash-pagination .dot");
    
    slides.forEach((slide, idx) => {
        slide.classList.toggle("active", idx === index);
    });
    dots.forEach((dot, idx) => {
        dot.classList.toggle("active", idx === index);
    });
    activeSlideIndex = index;
}

// Auto transition splash slides every 4 seconds
setInterval(() => {
    if (document.getElementById("splash-screen").classList.contains("active")) {
        let nextSlide = (activeSlideIndex + 1) % 3;
        setSplashSlide(nextSlide);
    }
}, 4000);

// Open / Close Login Modal
function openLoginModal() {
    document.getElementById("login-modal").classList.add("active");
}

function closeLoginModal() {
    document.getElementById("login-modal").classList.remove("active");
    // Hide OTP step
    document.getElementById("otp-step").classList.remove("active");
    document.getElementById("otp-step").style.display = "none";
}

// Handle Telecom selection
function selectTelecom(element) {
    const btns = document.querySelectorAll(".telecom-btn");
    btns.forEach(btn => btn.classList.remove("active"));
    element.classList.add("active");
    appState.selectedTelecomNetwork = element.getAttribute("data-network");
}

// OTP Request
function sendOTP() {
    const phoneInput = document.getElementById("login-phone").value.trim();
    if (!phoneInput || phoneInput.length < 8) {
        showToast("Fadlan geli lambar sax ah (Please enter a valid phone number).");
        return;
    }
    
    showToast(`Sending OTP code via ${appState.selectedTelecomNetwork} SMS gateway...`);
    
    setTimeout(() => {
        document.getElementById("sent-phone-display").innerText = `+252 ${phoneInput}`;
        const otpStep = document.getElementById("otp-step");
        otpStep.style.display = "block";
        setTimeout(() => {
            otpStep.classList.add("active");
            showToast("OTP Code Sent! Enter '1234' to verify.");
        }, 50);
        document.getElementById("otp-1").focus();
    }, 1000);
}

// OTP Digit Focus movement
function moveOTPFocus(current, nextFieldId) {
    if (current.value.length === 1) {
        document.getElementById(nextFieldId).focus();
    }
}

// Verify OTP
function verifyOTP() {
    const o1 = document.getElementById("otp-1").value;
    const o2 = document.getElementById("otp-2").value;
    const o3 = document.getElementById("otp-3").value;
    const o4 = document.getElementById("otp-4").value;
    const code = o1 + o2 + o3 + o4;
    
    if (code === "1234") {
        showToast("OTP Verification Successful!");
        appState.isLoggedIn = true;
        
        // Hide splash and login
        closeLoginModal();
        document.getElementById("splash-screen").classList.remove("active");
        document.getElementById("app-wrapper").classList.add("active");
        
        updateDashboardView();
        showToast("Ku soo dhawoow Fududeeye! (Welcome to Fududeeye)");
    } else {
        showToast("Koodhku waa khaldan yahay (Incorrect code. Try '1234').");
    }
}

// Logout
function logOut() {
    appState.isLoggedIn = false;
    document.getElementById("app-wrapper").classList.remove("active");
    document.getElementById("splash-screen").classList.add("active");
    showToast("Signed Out successfully.");
}

// SWITCH VIEWS / TABS
function switchTab(tabId) {
    // Hide all views
    const views = document.querySelectorAll(".app-view");
    views.forEach(view => view.classList.remove("active"));
    
    // Unactivate all sidebar items
    const menuItems = document.querySelectorAll(".sidebar-menu .menu-item");
    menuItems.forEach(item => item.classList.remove("active"));

    // Reset Top navbar active links
    const navLinks = document.querySelectorAll(".nav-links a");
    navLinks.forEach(link => link.classList.remove("active"));

    if (tabId === "home") {
        document.getElementById("view-home").classList.add("active");
        document.getElementById("tab-home").classList.add("active");
        document.getElementById("nav-home-link").classList.add("active");
        renderFeaturedListings();
    } 
    else if (tabId === "search") {
        document.getElementById("view-search").classList.add("active");
        document.getElementById("tab-search").classList.add("active");
        document.getElementById("nav-explore-link").classList.add("active");
        applyFilters();
    }
    else if (tabId === "listings" || tabId === "listings-all" || tabId === "listings-properties" || tabId === "listings-items") {
        // Map Listing menu item
        document.getElementById("view-search").classList.add("active");
        document.getElementById("tab-listings").classList.add("active");
        
        // Adjust category filters directly
        if (tabId === "listings-properties") {
            appState.filters.context = "RENT";
        } else if (tabId === "listings-items") {
            appState.filters.context = "ITEM";
        } else {
            appState.filters.context = "ALL";
        }
        applyFilters();
    }
    else if (tabId === "messages") {
        document.getElementById("view-messages").classList.add("active");
        document.getElementById("tab-messages").classList.add("active");
        renderChatThreads();
    }
    else if (tabId === "saved") {
        document.getElementById("view-saved").classList.add("active");
        document.getElementById("tab-saved").classList.add("active");
        renderSavedItems();
    }
    else if (tabId === "dashboard") {
        document.getElementById("view-dashboard").classList.add("active");
        document.getElementById("nav-services-link").classList.add("active");
        updateDashboardView();
    }
    
    appState.currentTab = tabId;
    
    // Close sidebar on mobile
    document.getElementById("sidebar").classList.remove("active");
}

// Switch Category Filters via Pill buttons
function selectCategoryPill(element) {
    const pills = document.querySelectorAll(".category-pill");
    pills.forEach(p => p.classList.remove("active"));
    element.classList.add("active");
    
    const category = element.getAttribute("data-category");
    appState.selectedPill = category;
    
    // Filter Featured lists reactively
    renderFeaturedListings(category);
}

// Redirect quick links to categories
function switchCategoryFilter(category) {
    appState.filters.context = category;
    switchTab("search");
}

// RENDER FEATURED HOME PAGE CARDS
function renderFeaturedListings(categoryFilter = "ALL") {
    const propGrid = document.getElementById("featured-properties-grid");
    const itemGrid = document.getElementById("featured-items-grid");
    
    propGrid.innerHTML = "";
    itemGrid.innerHTML = "";
    
    // Get listings filtering by location
    let listData = MOCK_DB.listings.filter(listing => {
        const matchesLocation = listing.location_name.toLowerCase().includes(appState.currentLocation.split(",")[0].toLowerCase());
        const matchesCategory = categoryFilter === "ALL" || listing.category === categoryFilter;
        return matchesLocation && matchesCategory && listing.status === "ACTIVE";
    });
    
    // Properties
    let properties = listData.filter(l => l.category === "RENT" || l.category === "SALE");
    // Items
    let items = listData.filter(l => l.category === "ITEM");
    
    if (properties.length === 0) {
        propGrid.innerHTML = `<div class="no-listings-message"><p>No featured properties found in ${appState.currentLocation.split(",")[0]}.</p></div>`;
    } else {
        properties.forEach(prop => {
            propGrid.appendChild(createListingCard(prop));
        });
    }
    
    if (items.length === 0) {
        itemGrid.innerHTML = `<div class="no-listings-message"><p>No household goods found in ${appState.currentLocation.split(",")[0]}.</p></div>`;
    } else {
        items.forEach(item => {
            itemGrid.appendChild(createListingCard(item, true)); // 2col item style
        });
    }
    
    safeCreateIcons();
}

// HTML Card Generator
function createListingCard(listing, isItem2Col = false) {
    const card = document.createElement("div");
    card.className = `listing-card ${isItem2Col ? 'item-card-2col' : ''}`;
    card.setAttribute("onclick", `openDetailsModal('${listing.id}')`);
    
    // Heart Active Status
    const isFavorited = appState.favorites.includes(listing.id);
    const heartClass = isFavorited ? 'active' : '';
    
    // Formatted details
    const priceText = listing.category === "RENT" ? `$${listing.price.toLocaleString()}/mo` : `$${listing.price.toLocaleString()}`;
    const badgeHTML = listing.badge ? `<span class="card-badge">${listing.badge}</span>` : '';
    
    let specsHTML = "";
    if (listing.category === "ITEM") {
        specsHTML = `
            <div class="card-spec-item"><i data-lucide="tag" style="width: 14px; height: 14px;"></i> <span>${listing.item_condition.replace('_', ' ')}</span></div>
            <div class="card-spec-item"><i data-lucide="package" style="width: 14px; height: 14px;"></i> <span>${listing.item_brand}</span></div>
        `;
    } else {
        specsHTML = `
            <div class="card-spec-item"><i data-lucide="bed" style="width: 14px; height: 14px;"></i> <span>${listing.bedrooms || 0} Beds</span></div>
            <div class="card-spec-item"><i data-lucide="bath" style="width: 14px; height: 14px;"></i> <span>${listing.bathrooms || 0} Baths</span></div>
            <div class="card-spec-item"><i data-lucide="maximize" style="width: 14px; height: 14px;"></i> <span>${listing.area_sqm} m²</span></div>
        `;
    }
    
    card.innerHTML = `
        <div class="card-img-wrapper" onclick="event.stopPropagation(); openDetailsModal('${listing.id}')">
            ${badgeHTML}
            <img src="${listing.images[0]}" alt="${listing.title}" class="card-img">
            <button class="card-heart-btn ${heartClass}" onclick="toggleFavorite(event, '${listing.id}')">
                <i data-lucide="heart"></i>
            </button>
        </div>
        <div class="card-info">
            <div class="card-price">${priceText}</div>
            <h3 class="card-title">${listing.title}</h3>
            <div class="card-location"><i data-lucide="map-pin" style="width: 12px; height: 12px; color: var(--accent);"></i> ${listing.location_name}</div>
            <div class="card-specs">
                ${specsHTML}
            </div>
        </div>
    `;
    
    return card;
}

// Global search handling
function handleGlobalSearch(query) {
    appState.filters.searchQuery = query;
    if (query.trim().length > 0) {
        if (appState.currentTab !== "search") {
            switchTab("search");
        } else {
            applyFilters();
        }
    }
}

// Location picker toggling
function toggleLocationMenu(event) {
    event.stopPropagation();
    document.getElementById("location-menu").classList.toggle("active");
}

function selectLocation(locName) {
    appState.currentLocation = locName;
    document.getElementById("current-location-text").innerText = locName;
    document.getElementById("location-menu").classList.remove("active");
    
    showToast(`Location set to: ${locName}`);
    renderFeaturedListings(appState.selectedPill);
    applyFilters();
}

// Toggle Favorites
function toggleFavorite(event, listingId) {
    event.stopPropagation();
    
    const index = appState.favorites.indexOf(listingId);
    if (index === -1) {
        appState.favorites.push(listingId);
        showToast("Added to Saved Items");
    } else {
        appState.favorites.splice(index, 1);
        showToast("Removed from Saved Items");
    }
    
    // Update elements
    updateFavoritesUI();
}

function updateFavoritesUI() {
    const count = appState.favorites.length;
    document.getElementById("saved-count-display").innerText = count;
    document.getElementById("stat-saved-count").innerText = count;
    
    // Re-render grids
    if (appState.currentTab === "home") {
        renderFeaturedListings(appState.selectedPill);
    } else if (appState.currentTab === "search") {
        applyFilters();
    } else if (appState.currentTab === "saved") {
        renderSavedItems();
    }
}

// Render Saved Items Tab
function renderSavedItems() {
    const grid = document.getElementById("saved-items-grid");
    grid.innerHTML = "";
    
    if (appState.favorites.length === 0) {
        grid.innerHTML = `<div class="no-listings-message" style="grid-column: 1/-1;"><p>No bookmarked listings. Click the heart icon to save listings.</p></div>`;
        return;
    }
    
    let savedListings = MOCK_DB.listings.filter(listing => appState.favorites.includes(listing.id));
    
    savedListings.forEach(listing => {
        grid.appendChild(createListingCard(listing, listing.category === "ITEM"));
    });
    
    safeCreateIcons();
}

// FILTER SYSTEM MODALS
function openFilterModal() {
    document.getElementById("filter-modal").classList.add("active");
    // Pre-populate fields from state
    document.getElementById("filter-location").value = appState.filters.location;
    document.getElementById("filter-min-price").value = appState.filters.minPrice;
    document.getElementById("filter-max-price").value = appState.filters.maxPrice;
    document.getElementById("filter-property-type").value = appState.filters.propertyType;
    
    // Set active toggle tab
    const tabs = document.querySelectorAll(".category-toggle-tabs button");
    tabs.forEach(tab => {
        tab.classList.toggle("active", tab.getAttribute("data-context") === appState.filters.context);
    });
    
    adjustFilterFormVisibility(appState.filters.context);
}

function closeFilterModal() {
    document.getElementById("filter-modal").classList.remove("active");
}

function setFilterContext(button) {
    const tabs = button.parentNode.querySelectorAll("button");
    tabs.forEach(t => t.classList.remove("active"));
    button.classList.add("active");
    
    const context = button.getAttribute("data-context");
    appState.filters.context = context;
    adjustFilterFormVisibility(context);
}

function adjustFilterFormVisibility(context) {
    const propGroup = document.getElementById("property-filters-group");
    if (context === "ITEM") {
        propGroup.classList.add("hide");
    } else {
        propGroup.classList.remove("hide");
    }
}

function setFilterBeds(button) {
    const pills = button.parentNode.querySelectorAll("button");
    pills.forEach(p => p.classList.remove("active"));
    button.classList.add("active");
    appState.filters.beds = button.getAttribute("data-beds");
}

function resetFilters() {
    appState.filters = {
        location: "",
        context: "ALL",
        minPrice: null,
        maxPrice: null,
        propertyType: "",
        beds: "any",
        searchQuery: ""
    };
    
    document.getElementById("filter-location").value = "";
    document.getElementById("filter-min-price").value = "";
    document.getElementById("filter-max-price").value = "";
    document.getElementById("filter-property-type").value = "";
    document.getElementById("global-search").value = "";
    
    const bedPills = document.querySelectorAll(".bedroom-pills button");
    bedPills.forEach((p, idx) => p.classList.toggle("active", idx === 0));
    
    const contextTabs = document.querySelectorAll(".category-toggle-tabs button");
    contextTabs.forEach((tab, idx) => tab.classList.toggle("active", idx === 0));
    
    adjustFilterFormVisibility("ALL");
    showToast("Filters Reset");
}

// Apply Filters and Search
function applyFilters() {
    closeFilterModal();
    
    // Grab latest values from form (if modal was opened)
    appState.filters.location = document.getElementById("filter-location").value;
    appState.filters.minPrice = document.getElementById("filter-min-price").value ? parseFloat(document.getElementById("filter-min-price").value) : null;
    appState.filters.maxPrice = document.getElementById("filter-max-price").value ? parseFloat(document.getElementById("filter-max-price").value) : null;
    appState.filters.propertyType = document.getElementById("filter-property-type").value;
    
    // Filter logic
    let results = MOCK_DB.listings.filter(listing => {
        // Location filter (check if selected region matches)
        if (appState.filters.location && listing.location_name !== appState.filters.location) {
            return false;
        }
        
        // Category context filter (RENT, SALE, ITEM)
        if (appState.filters.context !== "ALL" && listing.category !== appState.filters.context) {
            return false;
        }
        
        // Price Range filter
        if (appState.filters.minPrice && listing.price < appState.filters.minPrice) {
            return false;
        }
        if (appState.filters.maxPrice && listing.price > appState.filters.maxPrice) {
            return false;
        }
        
        // Property specifics filters (only for properties)
        if (listing.category !== "ITEM") {
            if (appState.filters.propertyType && listing.property_type !== appState.filters.propertyType) {
                return false;
            }
            if (appState.filters.beds !== "any") {
                const targetBeds = appState.filters.beds === "4+" ? 4 : parseInt(appState.filters.beds);
                if (targetBeds === 4) {
                    if (!listing.bedrooms || listing.bedrooms < 4) return false;
                } else {
                    if (listing.bedrooms !== targetBeds) return false;
                }
            }
        }
        
        // Search Query search matching title, description, landmarks
        if (appState.filters.searchQuery) {
            const q = appState.filters.searchQuery.toLowerCase();
            const matchesTitle = listing.title.toLowerCase().includes(q);
            const matchesDesc = listing.description.toLowerCase().includes(q);
            const matchesLandmark = listing.address_notes && listing.address_notes.toLowerCase().includes(q);
            if (!matchesTitle && !matchesDesc && !matchesLandmark) {
                return false;
            }
        }
        
        return listing.status === "ACTIVE";
    });
    
    // Render
    const searchGrid = document.getElementById("search-results-grid");
    searchGrid.innerHTML = "";
    
    document.getElementById("results-count-text").innerText = `${results.length} Results Found`;
    
    if (results.length === 0) {
        searchGrid.innerHTML = `<div class="no-listings-message" style="grid-column: 1/-1;"><p>No listings match your filter criteria.</p></div>`;
    } else {
        results.forEach(listing => {
            searchGrid.appendChild(createListingCard(listing, listing.category === "ITEM"));
        });
    }
    
    safeCreateIcons();
}

// 5. DETAILED LISTING DETAILS VIEW MODAL
function openDetailsModal(listingId) {
    const listing = MOCK_DB.listings.find(l => l.id === listingId);
    if (!listing) return;
    
    appState.activeDetailListing = listing;
    appState.activeDetailImageIndex = 0;
    
    // Set UI elements
    document.getElementById("details-hero-img").src = listing.images[0];
    document.getElementById("details-slider-tracker").innerText = `1/${listing.images.length}`;
    
    // Heart Status
    const isFavorited = appState.favorites.includes(listing.id);
    document.getElementById("details-heart-btn").classList.toggle("active", isFavorited);
    
    // Core Details
    document.getElementById("details-category-badge").innerText = `FOR ${listing.category}`;
    document.getElementById("details-title").innerText = listing.title;
    document.getElementById("details-location").innerHTML = `<i data-lucide="map-pin" style="width: 14px; height: 14px; color: var(--accent);"></i> ${listing.location_name}`;
    document.getElementById("details-landmark").innerText = listing.address_notes || "N/A";
    
    document.getElementById("details-price").innerText = `$${listing.price.toLocaleString()}`;
    document.getElementById("details-price-freq").innerText = listing.category === "RENT" ? "/ mo" : "";
    document.getElementById("details-desc").innerText = listing.description;
    
    // Specs ribbons vs Items ribbons
    const propRibbon = document.getElementById("details-specs-ribbon");
    const itemRibbon = document.getElementById("details-item-ribbon");
    const amenitiesGroup = document.getElementById("details-amenities-group");
    
    if (listing.category === "ITEM") {
        propRibbon.classList.add("hide");
        itemRibbon.classList.remove("hide");
        amenitiesGroup.classList.add("hide");
        
        document.getElementById("details-item-condition").innerText = listing.item_condition.replace('_', ' ');
        document.getElementById("details-item-brand").innerText = listing.item_brand;
    } else {
        propRibbon.classList.remove("hide");
        itemRibbon.classList.add("hide");
        amenitiesGroup.classList.remove("hide");
        
        document.getElementById("details-beds").innerText = `${listing.bedrooms || 0} Beds`;
        document.getElementById("details-baths").innerText = `${listing.bathrooms || 0} Baths`;
        document.getElementById("details-area").innerText = `${listing.area_sqm} m²`;
        document.getElementById("details-type").innerText = listing.property_type.charAt(0) + listing.property_type.slice(1).toLowerCase();
        
        // Amenities list mapping
        renderAmenitiesList(listing);
    }
    
    // Identity Rating calculation & badge
    // trust calculation formula: T = 0.4*V + 0.3*R + 0.3*A
    // We simulate V = listing.user_trust/100, etc.
    const scoreVal = listing.user_trust || 80;
    document.getElementById("details-trust-score").innerText = `${scoreVal}%`;
    
    const trustLevel = document.getElementById("details-trust-level");
    if (scoreVal >= 90) {
        trustLevel.innerText = "Highly Reliable";
        trustLevel.className = "badge badge-trust-high";
    } else if (scoreVal >= 75) {
        trustLevel.innerText = "Verified Listing";
        trustLevel.className = "badge";
    } else {
        trustLevel.innerText = "Standard Listing";
        trustLevel.className = "badge";
    }
    
    // Seller Info
    document.getElementById("details-agent-avatar").src = listing.user_avatar;
    document.getElementById("details-agent-name").innerText = listing.user_name;
    document.getElementById("details-agent-role").innerText = listing.user_role;
    document.getElementById("details-agent-trust").innerText = `T = ${scoreVal}%`;
    
    // Open Modal
    document.getElementById("details-modal").classList.add("active");
    safeCreateIcons();
    
    // Async record a view event (API Simulation)
    listing.views_count++;
}

function closeDetailsModal() {
    document.getElementById("details-modal").classList.remove("active");
}

// Slide Hero image
function slideHeroImage(direction) {
    const listing = appState.activeDetailListing;
    if (!listing || listing.images.length <= 1) return;
    
    appState.activeDetailImageIndex = (appState.activeDetailImageIndex + direction + listing.images.length) % listing.images.length;
    document.getElementById("details-hero-img").src = listing.images[appState.activeDetailImageIndex];
    document.getElementById("details-slider-tracker").innerText = `${appState.activeDetailImageIndex + 1}/${listing.images.length}`;
}

// Favorite toggle inside modal details
function toggleDetailsFavorite() {
    if (!appState.activeDetailListing) return;
    
    const listingId = appState.activeDetailListing.id;
    const index = appState.favorites.indexOf(listingId);
    if (index === -1) {
        appState.favorites.push(listingId);
        document.getElementById("details-heart-btn").classList.add("active");
        showToast("Added to Saved Items");
    } else {
        appState.favorites.splice(index, 1);
        document.getElementById("details-heart-btn").classList.remove("active");
        showToast("Removed from Saved Items");
    }
    updateFavoritesUI();
}

function renderAmenitiesList(listing) {
    const grid = document.getElementById("details-features-grid");
    grid.innerHTML = "";
    
    const amenities = [
        { name: "Water Available", status: listing.has_water },
        { name: "Electricity 24/7", status: listing.has_electricity },
        { name: "Security Guard", status: listing.has_security },
        { name: "Parking Space", status: listing.has_parking },
        { name: "Fully Furnished", status: listing.is_furnished }
    ];
    
    amenities.forEach(a => {
        const item = document.createElement("div");
        item.className = "checklist-item";
        
        const iconName = a.status ? "check-circle" : "x-circle";
        const iconClass = a.status ? "check-icon" : "cross-icon";
        
        item.innerHTML = `
            <i data-lucide="${iconName}" class="${iconClass}"></i>
            <span>${a.name}</span>
        `;
        grid.appendChild(item);
    });
}

// PERSISTENT ACTION DIALERS / MESSAGING
function startChatFromDetails() {
    const listing = appState.activeDetailListing;
    if (!listing) return;
    
    closeDetailsModal();
    switchTab("messages");
    
    // Check if thread exists, else create it
    let existingThread = MOCK_DB.chats.find(c => c.agent_id === listing.user_id);
    if (!existingThread) {
        existingThread = {
            id: `chat-${Date.now()}`,
            agent_id: listing.user_id,
            agent_name: listing.user_name,
            agent_avatar: listing.user_avatar,
            agent_phone: "+252 90 779 1111",
            agent_whatsapp: "252907791111",
            listing_title: listing.title,
            messages: [
                { sender: "agent", text: `Asc, thank you for checking out my listing: "${listing.title}". Let me know if you want to negotiate!`, time: "Just now" }
            ]
        };
        MOCK_DB.chats.unshift(existingThread);
    }
    
    renderChatThreads();
    openChatThread(existingThread.id);
}

function triggerCallDialer() {
    const listing = appState.activeDetailListing;
    if (!listing) return;
    
    showToast(`Opening dialer/WhatsApp link for agent ${listing.user_name} (+252 90 779 4321)...`);
    window.open(`https://wa.me/252907794321?text=Asc,%20I%20am%20interested%20in%20your%20listing:%20${encodeURIComponent(listing.title)}`, "_blank");
}

function simulateCall() {
    showToast("Dialing phone number: +252 90 123 4567");
}

function simulateWhatsApp() {
    showToast("Opening WhatsApp chat with broker...");
    window.open("https://wa.me/252901234567", "_blank");
}

// 6. ADD LISTING CODE
function openAddListingModal() {
    if (!appState.isLoggedIn) {
        openLoginModal();
        showToast("Fadlan Soo Gali si aad xayaysiin u sameyso (Please Login to post listings).");
        return;
    }
    document.getElementById("add-listing-modal").classList.add("active");
    // Reset form
    document.getElementById("add-listing-form").reset();
    appState.attachedPhotos = [];
    document.getElementById("attached-photos-container").innerHTML = "";
    setNewListingCategory("RENT");
}

function closeAddListingModal() {
    document.getElementById("add-listing-modal").classList.remove("active");
}

let newListingCategory = "RENT";
function setNewListingCategory(category) {
    newListingCategory = category;
    
    const tabs = document.querySelectorAll("#add-listing-form .category-toggle-tabs button");
    tabs.forEach(tab => {
        tab.classList.toggle("active", tab.getAttribute("data-new-cat") === category);
    });
    
    const propFields = document.getElementById("new-property-fields");
    const itemFields = document.getElementById("new-item-fields");
    
    if (category === "ITEM") {
        propFields.classList.add("hide");
        itemFields.classList.remove("hide");
    } else {
        propFields.classList.remove("hide");
        itemFields.classList.add("hide");
    }
}

// Simulate Photo Picker with mock assets
function simulateSelectPhoto() {
    const presets = [
        "assets/modern_villa.png",
        "assets/seafront_tower.png",
        "assets/farmland_plot.png",
        "assets/luxury_sofa.png",
        "assets/smart_refrigerator.png"
    ];
    
    // Pick next preset depending on current count
    const nextPhoto = presets[appState.attachedPhotos.length % presets.length];
    
    appState.attachedPhotos.push(nextPhoto);
    
    // Render Thumbnail
    const container = document.getElementById("attached-photos-container");
    const thumb = document.createElement("div");
    const photoId = Date.now();
    thumb.className = "attached-photo-preview";
    thumb.id = `photo-${photoId}`;
    thumb.innerHTML = `
        <img src="${nextPhoto}" alt="Uploaded image">
        <button class="remove-photo-btn" onclick="removePhoto('${photoId}', '${nextPhoto}')"><i data-lucide="x" style="width: 10px; height: 10px;"></i></button>
    `;
    
    container.appendChild(thumb);
    safeCreateIcons();
    showToast("Photo selected! On-device WebP compression applied.");
}

function removePhoto(domId, path) {
    const idx = appState.attachedPhotos.indexOf(path);
    if (idx !== -1) {
        appState.attachedPhotos.splice(idx, 1);
    }
    document.getElementById(`photo-${domId}`).remove();
}

function updateCharCount(textarea) {
    const count = textarea.value.length;
    document.getElementById("desc-char-count").innerText = `${count}/500`;
}

// Publish Listing
function publishListing(event) {
    event.preventDefault();
    
    const title = document.getElementById("new-title").value.trim();
    const price = parseFloat(document.getElementById("new-price").value);
    const location = document.getElementById("new-location").value;
    const landmark = document.getElementById("new-landmark").value.trim();
    const desc = document.getElementById("new-description").value.trim();
    
    if (appState.attachedPhotos.length === 0) {
        showToast("Fadlan ku dar ugu yaraan hal sawir (Please attach at least 1 photo).");
        return;
    }
    
    // Create new listing object
    const newListing = {
        id: `list-${Date.now()}`,
        user_id: appState.currentUser.id,
        user_name: appState.currentUser.full_name,
        user_avatar: appState.currentUser.avatar_url,
        user_role: appState.currentUser.role === "AGENT" ? "Verified Agent" : "Standard User",
        user_trust: appState.currentUser.trust_rating,
        category: newListingCategory,
        title: title,
        description: desc,
        price: price,
        location_name: location,
        address_notes: landmark,
        images: [...appState.attachedPhotos],
        status: "ACTIVE",
        views_count: 0,
        badge: "NEW LISTING",
        created_at: new Date().toISOString()
    };
    
    if (newListingCategory === "ITEM") {
        newListing.item_condition = document.getElementById("new-item-condition").value;
        newListing.item_brand = document.getElementById("new-item-brand").value || "Generic";
    } else {
        newListing.property_type = document.getElementById("new-prop-type").value;
        newListing.area_sqm = parseFloat(document.getElementById("new-area").value) || 100;
        newListing.bedrooms = parseInt(document.getElementById("new-beds").value) || 1;
        newListing.bathrooms = parseInt(document.getElementById("new-baths").value) || 1;
        newListing.has_water = document.getElementById("amenity-water").checked;
        newListing.has_electricity = document.getElementById("amenity-electricity").checked;
        newListing.has_security = document.getElementById("amenity-security").checked;
        newListing.has_parking = document.getElementById("amenity-parking").checked;
        newListing.is_furnished = document.getElementById("amenity-furnished").checked;
    }
    
    // Save to Database
    MOCK_DB.listings.unshift(newListing);
    appState.currentUser.active_count++;
    
    // Close modal
    closeAddListingModal();
    showToast("Xayaysiinta waa la daabacay! (Listing published successfully!)");
    
    // Switch view to Home and refresh
    switchTab("home");
}

// 7. MESSAGE / CHAT SYSTEM PANEL RENDERERS
function renderChatThreads() {
    const list = document.getElementById("chat-threads-list");
    list.innerHTML = "";
    
    MOCK_DB.chats.forEach(chat => {
        const lastMsg = chat.messages[chat.messages.length - 1];
        const isActive = appState.activeChatThreadId === chat.id ? "active" : "";
        const item = document.createElement("div");
        item.className = `thread-item ${isActive}`;
        item.setAttribute("onclick", `openChatThread('${chat.id}')`);
        
        item.innerHTML = `
            <img src="${chat.agent_avatar}" alt="${chat.agent_name}" class="avatar-img-sm">
            <div class="thread-info">
                <div class="thread-top">
                    <span class="thread-name">${chat.agent_name}</span>
                    <span class="thread-time">${lastMsg.time}</span>
                </div>
                <div class="thread-last-msg">${lastMsg.text}</div>
            </div>
        `;
        list.appendChild(item);
    });
}

function openChatThread(threadId) {
    appState.activeChatThreadId = threadId;
    
    // Highlight thread active
    renderChatThreads();
    
    const chat = MOCK_DB.chats.find(c => c.id === threadId);
    if (!chat) return;
    
    // Show window content
    document.getElementById("chat-placeholder").classList.add("hide");
    const activeWindow = document.getElementById("chat-active-window");
    activeWindow.classList.remove("hide");
    
    document.getElementById("active-agent-avatar").src = chat.agent_avatar;
    document.getElementById("active-agent-name").innerText = chat.agent_name;
    
    // Re-bind click actions
    document.getElementById("agent-phone-btn").setAttribute("onclick", `simulateCall()`);
    document.getElementById("agent-whatsapp-btn").setAttribute("onclick", `window.open('https://wa.me/${chat.agent_whatsapp}', '_blank')`);
    
    // Render messages
    renderChatMessages(chat);
}

function renderChatMessages(chat) {
    const box = document.getElementById("chat-messages-box");
    box.innerHTML = "";
    
    chat.messages.forEach(msg => {
        const bubble = document.createElement("div");
        bubble.className = `chat-bubble ${msg.sender === 'agent' ? 'agent' : 'user'}`;
        bubble.innerHTML = `
            <p>${msg.text}</p>
            <span class="chat-bubble-time">${msg.time}</span>
        `;
        box.appendChild(bubble);
    });
    
    // Scroll to bottom
    box.scrollTop = box.scrollHeight;
}

function handleChatKeyPress(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}

function sendMessage() {
    const input = document.getElementById("chat-input");
    const text = input.value.trim();
    if (!text || !appState.activeChatThreadId) return;
    
    const chat = MOCK_DB.chats.find(c => c.id === appState.activeChatThreadId);
    if (!chat) return;
    
    // Push message
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    chat.messages.push({
        sender: "user",
        text: text,
        time: timeStr
    });
    
    input.value = "";
    renderChatMessages(chat);
    renderChatThreads();
    
    // Trigger automated reply from broker
    setTimeout(() => {
        simulateAgentReply(chat);
    }, 1500);
}

function simulateAgentReply(chat) {
    const replies = [
        "Mahadsanid, I will speak to the landlord and get back to you shortly.",
        "Yes, we can arrange a viewing tomorrow at 4:00 PM. Does that work?",
        "Muuqaalka guriga waa mid aad u fiican, solid water storage system and reliable electrical backup grid.",
        "Ma rabtaa inaan kugu soo waco si aan u wada hadalno?"
    ];
    const randomReply = replies[Math.floor(Math.random() * replies.length)];
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    chat.messages.push({
        sender: "agent",
        text: randomReply,
        time: timeStr
    });
    
    // Check if still on the same thread
    if (appState.activeChatThreadId === chat.id) {
        renderChatMessages(chat);
    }
    renderChatThreads();
    
    // Trigger desktop notification bell
    document.getElementById("notif-badge").innerText = parseInt(document.getElementById("notif-badge").innerText) + 1;
    showToast(`New message from ${chat.agent_name}`);
}

// 8. PROFILE / DASHBOARD CONTROLS
function updateDashboardView() {
    document.getElementById("dashboard-username").innerText = appState.currentUser.full_name;
    document.getElementById("dashboard-phone").innerText = appState.currentUser.phone_number;
    
    // Update stats counts
    document.getElementById("stat-active-count").innerText = appState.currentUser.active_count;
    document.getElementById("stat-sold-count").innerText = appState.currentUser.sold_count;
    document.getElementById("stat-saved-count").innerText = appState.favorites.length;
    
    // Render User listings list
    renderMyListings();
}

function renderMyListings() {
    const container = document.getElementById("my-listings-container");
    container.innerHTML = "";
    
    const myListings = MOCK_DB.listings.filter(l => l.user_id === appState.currentUser.id);
    
    if (myListings.length === 0) {
        container.innerHTML = `<p class="no-listings-message" style="padding: 12px; font-size: 13px; color: var(--slate);">You have no active listings. Click '+ Post Listing' to add one.</p>`;
        return;
    }
    
    myListings.forEach(listing => {
        const row = document.createElement("div");
        row.className = "my-listing-row";
        
        const isFeatured = listing.badge === "HOT DEAL" || listing.badge === "FEATURED";
        const promoteBtnText = isFeatured ? "Promoted ✓" : "Promote ($5)";
        const promoteBtnClass = isFeatured ? "btn-outline" : "btn-accent";
        const promoteAttr = isFeatured ? "disabled" : `onclick="openUSSDModal('${listing.id}')"`;
        
        row.innerHTML = `
            <img src="${listing.images[0]}" alt="${listing.title}">
            <div class="my-listing-info">
                <h4>${listing.title}</h4>
                <p class="text-accent">$${listing.price.toLocaleString()} • ${listing.location_name}</p>
                <span style="font-size: 10px; color: var(--slate); font-weight: 700;">Views: ${listing.views_count}</span>
            </div>
            <div class="my-listing-actions">
                <button class="btn btn-primary btn-sm" onclick="toggleListingSold('${listing.id}')">Sold/Rented</button>
                <button class="btn ${promoteBtnClass} btn-sm" ${promoteAttr}>${promoteBtnText}</button>
            </div>
        `;
        container.appendChild(row);
    });
}

function toggleListingSold(listingId) {
    const listing = MOCK_DB.listings.find(l => l.id === listingId);
    if (!listing) return;
    
    listing.status = "SOLD_RENTED";
    appState.currentUser.active_count--;
    appState.currentUser.sold_count++;
    
    showToast("Listing status updated to Sold / Rented!");
    updateDashboardView();
}

// 8. BILLING ENGINE PAYMENT USSD SIMULATOR
function openUSSDModal(listingId) {
    appState.activeUSSDListingId = listingId;
    const listing = MOCK_DB.listings.find(l => l.id === listingId);
    if (!listing) return;
    
    // Determine provider title
    let title = "Zaad Service";
    let networkMsg = "Zaad Service ($5)";
    if (appState.selectedTelecomNetwork === "Hormuud") {
        title = "EVC Plus Push";
        networkMsg = "EVC Plus Service ($5)";
    } else if (appState.selectedTelecomNetwork === "Golis") {
        title = "Sahal Service";
        networkMsg = "Sahal Service ($5)";
    } else if (appState.selectedTelecomNetwork === "Somtel") {
        title = "eDahab Service";
        networkMsg = "eDahab Wallet ($5)";
    }
    
    document.getElementById("ussd-title").innerText = title;
    document.getElementById("ussd-message").innerText = `Do you want to pay $5.00 to Fududeeye Company to feature your listing "${listing.title}" for 7 Days?`;
    document.getElementById("ussd-pin").value = "";
    
    document.getElementById("ussd-modal").classList.add("active");
}

function cancelUSSD() {
    document.getElementById("ussd-modal").classList.remove("active");
    showToast("Payment Cancelled.");
}

function submitUSSD() {
    const pin = document.getElementById("ussd-pin").value;
    if (pin.length < 4) {
        alert("Fadlan geli PIN sax ah (Please enter a valid 4-digit PIN).");
        return;
    }
    
    // Simulate transaction delay
    showToast("Processing wallet transaction on telecom network gateway...");
    document.getElementById("ussd-modal").classList.remove("active");
    
    setTimeout(() => {
        // Upgrade listing badge to FEATURED
        const listing = MOCK_DB.listings.find(l => l.id === appState.activeUSSDListingId);
        if (listing) {
            listing.badge = "HOT DEAL";
            showToast(`Payment Approved! Listing "${listing.title}" is now featured.`);
            updateDashboardView();
            renderFeaturedListings(appState.selectedPill);
        }
    }, 1500);
}

// Agent Verification badging request
function toggleVerificationStatus() {
    const badge = document.getElementById("verification-request-badge");
    const agentBadge = document.getElementById("agent-badge");
    
    if (badge.innerText === "Get Verified") {
        badge.innerText = "Pending";
        badge.style.backgroundColor = "var(--accent)";
        badge.style.color = "var(--white)";
        showToast("Verification request submitted! Admin will audit your broker documentation.");
    } else {
        badge.innerText = "Get Verified";
        badge.style.backgroundColor = "var(--slate-light)";
        badge.style.color = "var(--slate)";
    }
}

// BIND COMPONENT DOM EVENTS
function bindAppEvents() {
    // Prevent sidebar click bubble close
    const sidebar = document.getElementById("sidebar");
    sidebar.addEventListener("click", (e) => {
        e.stopPropagation();
    });

    // Close notification/location menu clicking outside
    document.addEventListener("click", () => {
        document.getElementById("notification-panel").classList.remove("active");
        document.getElementById("location-menu").classList.remove("active");
    });
}

function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("active");
}

function toggleNotificationPanel(event) {
    event.stopPropagation();
    document.getElementById("notification-panel").classList.toggle("active");
}

function markAllNotificationsRead(event) {
    event.stopPropagation();
    const items = document.querySelectorAll(".notif-item");
    items.forEach(i => i.classList.remove("unread"));
    document.getElementById("notif-badge").style.display = "none";
    showToast("All notifications marked as read");
}

// Dynamic Toast
function showToast(message) {
    const toast = document.getElementById("toast-banner");
    document.getElementById("toast-message").innerText = message;
    
    toast.classList.add("active");
    setTimeout(() => {
        toast.classList.remove("active");
    }, 3500);
}
