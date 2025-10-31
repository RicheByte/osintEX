// OSINTEX Extension - Main JavaScript

let allData = null;
let favorites = new Set();
let currentView = 'all';
let currentCategory = null;
let searchQuery = '';

// Initialize the extension
document.addEventListener('DOMContentLoaded', async () => {
    console.log('OSINTEX: Extension loaded, initializing...');
    try {
        await loadData();
        await loadFavorites();
        initializeUI();
        renderContent();
        console.log('OSINTEX: Initialization complete');
    } catch (error) {
        console.error('OSINTEX: Initialization error', error);
        showError('Failed to initialize extension. Please check console for details.');
    }
});

// Load the data.json file
async function loadData() {
    try {
        console.log('OSINTEX: Loading data.json...');
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        allData = await response.json();
        console.log(`OSINTEX: Loaded ${allData.categories.length} categories`);
        updateTotalCount();
    } catch (error) {
        console.error('OSINTEX: Error loading data:', error);
        throw error;
    }
}

// Load favorites from storage
async function loadFavorites() {
    try {
        console.log('OSINTEX: Loading favorites...');
        const result = await chrome.storage.sync.get(['favorites']);
        if (result.favorites) {
            favorites = new Set(result.favorites);
            console.log(`OSINTEX: Loaded ${favorites.size} favorites`);
        }
        updateFavCount();
    } catch (error) {
        console.error('OSINTEX: Error loading favorites:', error);
        // Continue even if favorites fail to load
    }
}

// Save favorites to storage
async function saveFavorites() {
    try {
        await chrome.storage.sync.set({ favorites: Array.from(favorites) });
        updateFavCount();
    } catch (error) {
        console.error('Error saving favorites:', error);
    }
}

// Initialize UI event listeners
function initializeUI() {
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // Search input
    const searchInput = document.getElementById('searchInput');
    const clearBtn = document.getElementById('clearSearch');
    
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase();
        clearBtn.classList.toggle('visible', searchQuery.length > 0);
        renderContent();
    });

    clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchQuery = '';
        clearBtn.classList.remove('visible');
        renderContent();
    });

    // Back to categories button
    document.getElementById('backToCategories').addEventListener('click', () => {
        currentCategory = null;
        renderCategoriesTab();
    });
}

// Switch between tabs
function switchTab(tab) {
    currentView = tab;
    
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tab);
    });

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    if (tab === 'all') {
        document.getElementById('allTab').classList.add('active');
    } else if (tab === 'favorites') {
        document.getElementById('favoritesTab').classList.add('active');
    } else if (tab === 'categories') {
        document.getElementById('categoriesTab').classList.add('active');
        if (currentCategory) {
            document.getElementById('categoryView').classList.add('active');
            document.getElementById('categoriesTab').classList.remove('active');
        }
    }

    renderContent();
}

// Render content based on current view
function renderContent() {
    if (currentView === 'all') {
        renderAllTab();
    } else if (currentView === 'favorites') {
        renderFavoritesTab();
    } else if (currentView === 'categories') {
        if (currentCategory) {
            renderCategoryView();
        } else {
            renderCategoriesTab();
        }
    }
    updateResultsCount();
}

// Render all search engines organized by category
function renderAllTab() {
    const container = document.getElementById('categoryList');
    container.innerHTML = '';

    let visibleCount = 0;

    allData.categories.forEach(category => {
        const filteredItems = filterItems(category.items);
        
        if (filteredItems.length === 0) return;

        const section = createCategorySection(category, filteredItems);
        container.appendChild(section);
        visibleCount += filteredItems.length;
    });

    if (visibleCount === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                </svg>
                <p>No results found</p>
                <small>Try a different search term</small>
            </div>
        `;
    }
}

// Render favorites tab
function renderFavoritesTab() {
    const container = document.getElementById('favoritesList');
    container.innerHTML = '';

    if (favorites.size === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <p>No favorites yet</p>
                <small>Click the star icon to add search engines to your favorites</small>
            </div>
        `;
        return;
    }

    // Group favorites by category
    const favoritesByCategory = {};
    
    allData.categories.forEach(category => {
        category.items.forEach(item => {
            const itemId = getItemId(item);
            if (favorites.has(itemId)) {
                if (!favoritesByCategory[category.name]) {
                    favoritesByCategory[category.name] = {
                        categoryId: category.id,
                        items: []
                    };
                }
                favoritesByCategory[category.name].items.push(item);
            }
        });
    });

    // Filter based on search query
    let hasResults = false;

    Object.keys(favoritesByCategory).sort().forEach(categoryName => {
        const categoryData = favoritesByCategory[categoryName];
        const filteredItems = filterItems(categoryData.items);
        
        if (filteredItems.length === 0) return;

        hasResults = true;
        const section = createCategorySection(
            { name: categoryName, id: categoryData.categoryId },
            filteredItems
        );
        container.appendChild(section);
    });

    if (!hasResults) {
        container.innerHTML = `
            <div class="empty-state">
                <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                </svg>
                <p>No results found</p>
                <small>Try a different search term</small>
            </div>
        `;
    }
}

// Render categories grid
function renderCategoriesTab() {
    const container = document.getElementById('categoriesGrid');
    container.innerHTML = '';

    document.getElementById('categoryView').classList.remove('active');
    document.getElementById('categoriesTab').classList.add('active');

    allData.categories.forEach(category => {
        const card = createCategoryCard(category);
        container.appendChild(card);
    });
}

// Render single category view
function renderCategoryView() {
    if (!currentCategory) return;

    document.getElementById('categoriesTab').classList.remove('active');
    document.getElementById('categoryView').classList.add('active');

    const category = allData.categories.find(c => c.id === currentCategory);
    if (!category) return;

    document.getElementById('categoryTitle').textContent = category.name;
    document.getElementById('categoryDescription').textContent = category.description || '';

    const container = document.getElementById('categoryItems');
    container.innerHTML = '';

    const filteredItems = filterItems(category.items);

    if (filteredItems.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>No results found</p>
                <small>Try a different search term</small>
            </div>
        `;
        return;
    }

    filteredItems.forEach(item => {
        container.appendChild(createItemCard(item, true));
    });
}

// Create a category section
function createCategorySection(category, items) {
    const section = document.createElement('div');
    section.className = 'category-section';

    const header = document.createElement('div');
    header.className = 'category-header';
    header.innerHTML = `
        <h3 class="category-name">${category.name}</h3>
        <span class="category-badge">${items.length} ${items.length === 1 ? 'item' : 'items'}</span>
    `;

    const itemsGrid = document.createElement('div');
    itemsGrid.className = 'items-grid';

    items.forEach(item => {
        itemsGrid.appendChild(createItemCard(item));
    });

    section.appendChild(header);
    section.appendChild(itemsGrid);

    return section;
}

// Create a category card for grid view
function createCategoryCard(category) {
    const card = document.createElement('div');
    card.className = 'category-card';
    card.innerHTML = `
        <svg class="category-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
        </svg>
        <div class="category-card-name">${category.name}</div>
        <div class="category-card-count">${category.items.length} items</div>
    `;

    card.addEventListener('click', () => {
        currentCategory = category.id;
        renderCategoryView();
    });

    return card;
}

// Create an item card
function createItemCard(item, showUrl = false) {
    const card = document.createElement('div');
    card.className = 'item-card';

    const itemId = getItemId(item);
    const isFavorite = favorites.has(itemId);

    card.innerHTML = `
        <svg class="item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
        </svg>
        <div class="item-info">
            <div class="item-name">${item.name}</div>
            ${item.description ? `<div class="item-description">${item.description}</div>` : ''}
            ${showUrl ? `<div class="item-url">${item.url}</div>` : ''}
        </div>
        <button class="favorite-btn ${isFavorite ? 'active' : ''}" title="${isFavorite ? 'Remove from favorites' : 'Add to favorites'}">
            <svg viewBox="0 0 24 24" stroke-width="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
        </button>
    `;

    // Click on card to open URL
    card.addEventListener('click', (e) => {
        if (!e.target.closest('.favorite-btn')) {
            chrome.tabs.create({ url: item.url });
        }
    });

    // Favorite button
    const favBtn = card.querySelector('.favorite-btn');
    favBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFavorite(itemId);
        favBtn.classList.toggle('active');
        favBtn.title = favorites.has(itemId) ? 'Remove from favorites' : 'Add to favorites';
        
        if (currentView === 'favorites') {
            renderFavoritesTab();
        }
    });

    return card;
}

// Toggle favorite status
function toggleFavorite(itemId) {
    if (favorites.has(itemId)) {
        favorites.delete(itemId);
    } else {
        favorites.add(itemId);
    }
    saveFavorites();
}

// Filter items based on search query
function filterItems(items) {
    if (!searchQuery) return items;

    return items.filter(item => {
        const nameMatch = item.name.toLowerCase().includes(searchQuery);
        const descMatch = item.description && item.description.toLowerCase().includes(searchQuery);
        const urlMatch = item.url.toLowerCase().includes(searchQuery);
        return nameMatch || descMatch || urlMatch;
    });
}

// Generate a unique ID for an item
function getItemId(item) {
    return `${item.name}::${item.url}`;
}

// Update total count
function updateTotalCount() {
    if (!allData) return;
    const total = allData.categories.reduce((sum, cat) => sum + cat.items.length, 0);
    document.getElementById('totalCount').textContent = total;
}

// Update favorites count
function updateFavCount() {
    document.getElementById('favCount').textContent = favorites.size;
}

// Update results count
function updateResultsCount() {
    let count = 0;

    if (currentView === 'all') {
        allData.categories.forEach(category => {
            count += filterItems(category.items).length;
        });
    } else if (currentView === 'favorites') {
        const favoriteItems = [];
        allData.categories.forEach(category => {
            category.items.forEach(item => {
                const itemId = getItemId(item);
                if (favorites.has(itemId)) {
                    favoriteItems.push(item);
                }
            });
        });
        count = filterItems(favoriteItems).length;
    } else if (currentView === 'categories') {
        if (currentCategory) {
            const category = allData.categories.find(c => c.id === currentCategory);
            if (category) {
                count = filterItems(category.items).length;
            }
        } else {
            count = allData.categories.length;
        }
    }

    document.getElementById('resultsCount').textContent = `${count} result${count !== 1 ? 's' : ''}`;
}

// Show error message
function showError(message) {
    const container = document.querySelector('.content');
    if (container) {
        container.innerHTML = `
            <div class="empty-state">
                <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <p>Error</p>
                <small>${message}</small>
            </div>
        `;
    }
}
