document.addEventListener("DOMContentLoaded", () => {
  // Get search parameters from URL
  const urlParams = new URLSearchParams(window.location.search);
  
  // Extract search criteria
  const searchCriteria = {
    source: urlParams.get('source') || '',
    destination: urlParams.get('destination') || '',
    date: urlParams.get('date') || '',
    guests: urlParams.get('guests') || '',
    budget: urlParams.get('budget') || '',
    duration: urlParams.get('duration') || '',
    hotel: urlParams.get('hotel') || '',
    flight: urlParams.get('flight') || ''
  };

  // Display search criteria
  displaySearchCriteria(searchCriteria);

  // Load and filter packages
  loadAndFilterPackages(searchCriteria);
});

function displaySearchCriteria(criteria) {
  const criteriaTags = document.getElementById('criteria-tags');
  const searchSummary = document.getElementById('search-summary');
  
  let tags = [];
  let summary = [];

  if (criteria.source && criteria.source !== '') {
    tags.push(`<span class="bg-cyan-900 text-cyan-900 px-2 py-1 rounded">From: ${criteria.source}</span>`);
    summary.push(`from ${criteria.source}`);
  }
  
  if (criteria.destination && criteria.destination !== '') {
    tags.push(`<span class="bg-green-100 text-green-800 px-2 py-1 rounded">To: ${criteria.destination}</span>`);
    summary.push(`to ${criteria.destination}`);
  } else {
    summary.push('all destinations');
  }
  
  if (criteria.date) {
    const formattedDate = new Date(criteria.date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    tags.push(`<span class="bg-purple-100 text-purple-800 px-2 py-1 rounded">Date: ${formattedDate}</span>`);
    summary.push(`on ${formattedDate}`);
  }
  
  if (criteria.guests) {
    tags.push(`<span class="bg-orange-100 text-orange-800 px-2 py-1 rounded">Guests: ${criteria.guests}</span>`);
    summary.push(`for ${criteria.guests} guests`);
  }
  
  if (criteria.budget) {
    tags.push(`<span class="bg-red-100 text-red-800 px-2 py-1 rounded">Budget: ${criteria.budget}</span>`);
  }
  
  if (criteria.duration) {
    tags.push(`<span class="bg-indigo-100 text-indigo-800 px-2 py-1 rounded">Duration: ${criteria.duration}</span>`);
  }
  
  if (criteria.hotel) {
    tags.push(`<span class="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Hotel: ${criteria.hotel}</span>`);
  }
  
  if (criteria.flight) {
    tags.push(`<span class="bg-teal-100 text-teal-800 px-2 py-1 rounded">Flight: ${criteria.flight}</span>`);
  }

  criteriaTags.innerHTML = tags.join('');
  
  if (summary.length > 0) {
    if (summary.length === 1 && summary[0] === 'all destinations') {
      searchSummary.textContent = 'Showing all available packages';
    } else {
      searchSummary.textContent = `Showing packages ${summary.join(' ')}`;
    }
  } else {
    searchSummary.textContent = 'Showing all available packages';
  }
}

function loadAndFilterPackages(criteria) {
  const loading = document.getElementById('loading');
  const packageList = document.getElementById('package-list');
  const noResults = document.getElementById('no-results');

  // Show loading state
  loading.classList.remove('hidden');
  packageList.classList.add('hidden');
  noResults.classList.add('hidden');

  console.log('Search criteria:', criteria);

  fetch('data.json')
    .then(response => response.json())
    .then(data => {
      console.log('All packages loaded:', data);
      
      // Filter packages based on criteria
      const filteredPackages = filterPackages(data, criteria);
      
      console.log('Filtered packages:', filteredPackages);
      
      // Hide loading
      loading.classList.add('hidden');
      
      if (filteredPackages.length > 0) {
        displayPackages(filteredPackages);
        packageList.classList.remove('hidden');
      } else {
        noResults.classList.remove('hidden');
      }
    })
    .catch(error => {
      console.error('Error loading packages:', error);
      loading.classList.add('hidden');
      noResults.classList.remove('hidden');
    });
}

function filterPackages(packages, criteria) {
  console.log('Filtering packages with criteria:', criteria);
  
  // If no criteria are selected, show all packages
  const hasAnyCriteria = Object.values(criteria).some(value => value && value !== '');
  if (!hasAnyCriteria) {
    console.log('No criteria selected, showing all packages');
    return packages;
  }
  
  return packages.filter(package => {
    console.log('Checking package:', package.destination);
    
    // Destination filter - case insensitive and partial match
    if (criteria.destination && criteria.destination !== '') {
      const searchTerm = criteria.destination.toLowerCase().trim();
      const packageDestination = package.destination.toLowerCase();
      
      // Check for exact match or contains match
      if (!packageDestination.includes(searchTerm) && packageDestination !== searchTerm) {
        console.log(`Package ${package.destination} filtered out: destination mismatch (searching for "${searchTerm}")`);
        return false;
      }
    }
    
    // Source filter - case insensitive and partial match (if we add source data later)
    if (criteria.source && criteria.source !== '') {
      // For now, we don't have source data in packages, but this is ready for future use
      console.log(`Source filter applied: ${criteria.source}`);
    }
    
    // Budget filter
    if (criteria.budget) {
      const budgetRange = criteria.budget;
      const packagePrice = package.price;
      
      console.log(`Budget check: ${budgetRange} vs ₹${packagePrice}`);
      
      if (budgetRange === 'Under ₹20,000' && packagePrice >= 20000) {
        console.log(`Package ${package.destination} filtered out: budget too high`);
        return false;
      } else if (budgetRange === '₹20,000 - ₹50,000' && (packagePrice < 20000 || packagePrice > 50000)) {
        console.log(`Package ${package.destination} filtered out: budget out of range`);
        return false;
      } else if (budgetRange === '₹50,000+' && packagePrice < 50000) {
        console.log(`Package ${package.destination} filtered out: budget too low`);
        return false;
      }
    }
    
    // Duration filter
    if (criteria.duration) {
      const durationRange = criteria.duration;
      const packageDuration = package.duration;
      
      console.log(`Duration check: ${durationRange} vs ${packageDuration}`);
      
      // Extract number of days from package duration (e.g., "3 Days" -> 3)
      const packageDays = parseInt(packageDuration.match(/\d+/)[0]);
      
      if (durationRange === '1-3 Days' && (packageDays < 1 || packageDays > 3)) {
        console.log(`Package ${package.destination} filtered out: duration mismatch (1-3 days), has ${packageDays} days`);
        return false;
      } else if (durationRange === '4-6 Days' && (packageDays < 4 || packageDays > 6)) {
        console.log(`Package ${package.destination} filtered out: duration mismatch (4-6 days), has ${packageDays} days`);
        return false;
      } else if (durationRange === '7+ Days' && packageDays < 7) {
        console.log(`Package ${package.destination} filtered out: duration mismatch (7+ days), has ${packageDays} days`);
        return false;
      }
    }
    
    // Hotel filter
    if (criteria.hotel && package.hotel !== criteria.hotel) {
      console.log(`Package ${package.destination} filtered out: hotel mismatch`);
      return false;
    }
    
    // Flight filter
    if (criteria.flight) {
      const packageHasFlight = package.flight === 'Yes';
      
      console.log(`Flight check: ${criteria.flight} vs ${package.flight}`);
      
      if (criteria.flight !== package.flight) {
        console.log(`Package ${package.destination} filtered out: flight mismatch`);
        return false;
      }
    }
    
    console.log(`Package ${package.destination} passed all filters`);
    return true;
  });
}

function displayPackages(packages) {
  const packageList = document.getElementById('package-list');
  
  const packagesHTML = packages.map(package => {
    // Get destination image based on destination name
    const destinationImage = getDestinationImage(package.destination);
    
    return `
      <div class="bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden">
        <img src="${destinationImage}" alt="${package.destination}" class="w-full h-48 object-cover">
        <div class="p-6">
          <h3 class="text-xl font-semibold text-gray-800 mb-2">${package.destination} Package</h3>
          <p class="text-sm text-gray-600 mb-3">${package.description}</p>
          <div class="space-y-2 text-sm text-gray-600 mb-4">
            <p><i class="fas fa-clock mr-2"></i>${package.duration}</p>
            <p><i class="fas fa-hotel mr-2"></i>${package.hotel}</p>
            <p><i class="fas fa-plane mr-2"></i>Flight ${package.flight === 'Yes' ? 'Included' : 'Not Included'}</p>
          </div>
          <div class="flex items-center justify-between">
            <p class="text-cyan-900 font-bold text-lg">₹${package.price.toLocaleString()}/person</p>
            <div class="space-x-2">
              <a href="https://wa.me/917790909989?text=${encodeURIComponent(`Hi, I'm interested in the ${package.destination} package for ₹${package.price.toLocaleString()}. Can you provide more details?`)}" 
                 target="_blank" 
                 class="inline-flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm font-medium transition">
                <i class="fab fa-whatsapp"></i>
                Inquire
              </a>
              <button onclick="viewPackageDetails('${package.destination}')" 
                      class="bg-cyan-900 hover:bg-cyan-800 text-white px-3 py-2 rounded text-sm font-medium transition">
                Details
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
  
  packageList.innerHTML = packagesHTML;
}

function getDestinationImage(destination) {
  // Map destinations to images
  const imageMap = {
    // Beach Destinations
    'Goa': 'https://images.unsplash.com/photo-1652820330085-82a0c2b88d78',
    'Andaman': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96',
    'Maldives': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96',
    'Bali': 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1',
    'Thailand': 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4',
    'Sri Lanka': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96',
    
    // Hill Stations
    'Manali': 'https://images.pexels.com/photos/7086906/pexels-photo-7086906.jpeg',
    'Shimla': 'https://images.unsplash.com/photo-1597074866923-dc0589150358',
    'Ooty': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96',
    'Coorg': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96',
    'Kashmir': 'https://images.unsplash.com/photo-1593118845043-359e5f628214',
    'Ladakh': 'https://images.unsplash.com/photo-1593118845043-359e5f628214',
    'Darjeeling': 'https://images.unsplash.com/photo-1593118845043-359e5f628214',
    'Gangtok': 'https://images.unsplash.com/photo-1593118845043-359e5f628214',
    
    // Cultural & Heritage
    'Jaipur': 'https://images.unsplash.com/photo-1614181081801-f241632a4d49',
    'Agra': 'https://images.unsplash.com/photo-1564507592333-c60657eea523',
    'Varanasi': 'https://images.unsplash.com/photo-1587474260584-136574528ed5',
    'Rajasthan': 'https://images.unsplash.com/photo-1614181081801-f241632a4d49',
    'Kerala': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96',
    'Khajuraho': 'https://images.unsplash.com/photo-1564507592333-c60657eea523',
    'Hampi': 'https://images.unsplash.com/photo-1564507592333-c60657eea523',
    'Mysore': 'https://images.unsplash.com/photo-1614181081801-f241632a4d49',
    
    // Adventure & Wildlife
    'Rishikesh': 'https://images.unsplash.com/photo-1593118845043-359e5f628214',
    'Jim Corbett': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96',
    'Bandhavgarh': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96',
    'Kanha': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96',
    'Nepal': 'https://images.unsplash.com/photo-1593118845043-359e5f628214',
    'Bhutan': 'https://images.unsplash.com/photo-1593118845043-359e5f628214',
    
    // International
    'Dubai': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c',
    'Singapore': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd',
    'Switzerland': 'https://images.unsplash.com/photo-1593118845043-359e5f628214',
    'Paris': 'https://images.unsplash.com/photo-1502602898536-47ad22581b52',
    'London': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad',
    'New York': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9',
    'Tokyo': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf',
    'Australia': 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9',
    'New Zealand': 'https://images.unsplash.com/photo-1507692049790-de58290a4334',
    'Canada': 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000',
    'Munnar Tea Gardens': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96'
  };
  
  return imageMap[destination] || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1';
}

function viewPackageDetails(destination) {
  // For now, redirect to WhatsApp with package details
  const message = `Hi, I'd like to know more about the ${destination} package. Can you send me the detailed itinerary and inclusions?`;
  const whatsappURL = `https://wa.me/917790909989?text=${encodeURIComponent(message)}`;
  window.open(whatsappURL, '_blank');
}

// Debug function to show all packages
function showAllPackages() {
  fetch('data.json')
    .then(response => response.json())
    .then(data => {
      console.log('Showing all packages:', data);
      const loading = document.getElementById('loading');
      const packageList = document.getElementById('package-list');
      const noResults = document.getElementById('no-results');
      
      loading.classList.add('hidden');
      noResults.classList.add('hidden');
      
      displayPackages(data);
      packageList.classList.remove('hidden');
    })
    .catch(error => {
      console.error('Error loading packages:', error);
    });
}

// Modal search functions
function openSearchModal() {
  document.getElementById('search-modal').classList.remove('hidden');
}

function closeSearchModal() {
  document.getElementById('search-modal').classList.add('hidden');
}

function modalQuickSearch() {
  const searchInput = document.getElementById('modal-quick-search');
  const destination = searchInput.value.trim();
  
  if (destination) {
    const packagesURL = `packages.html?destination=${encodeURIComponent(destination)}`;
    window.location.href = packagesURL;
  } else {
    window.location.href = 'packages.html';
  }
}

function modalSearchDestination(destination) {
  const packagesURL = `packages.html?destination=${encodeURIComponent(destination)}`;
  window.location.href = packagesURL;
}

function modalAdvancedSearch() {
  const destination = document.getElementById('modal-destination').value;
  const budget = document.getElementById('modal-budget').value;
  const duration = document.getElementById('modal-duration').value;
  const hotel = document.getElementById('modal-hotel').value;
  const flight = document.getElementById('modal-flight').value;

  const params = new URLSearchParams();
  
  if (destination) params.append('destination', destination);
  if (budget) params.append('budget', budget);
  if (duration) params.append('duration', duration);
  if (hotel) params.append('hotel', hotel);
  if (flight) params.append('flight', flight);

  const packagesURL = `packages.html?${params.toString()}`;
  window.location.href = packagesURL;
}

// Allow Enter key in modal quick search
document.addEventListener('DOMContentLoaded', () => {
  const modalQuickSearchInput = document.getElementById('modal-quick-search');
  if (modalQuickSearchInput) {
    modalQuickSearchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        modalQuickSearch();
      }
    });
  }
  
  // Close modal when clicking outside
  const modal = document.getElementById('search-modal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeSearchModal();
      }
    });
  }
}); 