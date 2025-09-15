// DOM Elements
const pickForm = document.getElementById('pickForm');
const picksContainer = document.getElementById('picksContainer');

// API Base URL
const API_BASE = '/api';

// Utility function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Create a pick card element
function createPickCard(pick) {
    const card = document.createElement('div');
    card.className = 'pick-card rounded-xl p-6';
    card.innerHTML = `
        <div class="flex justify-between items-start mb-4">
            <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    ${pick.username.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h3 class="font-semibold text-lg">${escapeHtml(pick.username)}</h3>
                    <p class="text-sm text-gray-400">${formatDate(pick.created_at)}</p>
                </div>
            </div>
            ${pick.betting_code ? `
                <span class="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-medium">
                    ${escapeHtml(pick.betting_code)}
                </span>
            ` : ''}
        </div>
        
        <div class="mb-4">
            <h4 class="font-medium text-blue-300 mb-2">Match</h4>
            <p class="text-gray-200">${escapeHtml(pick.match)}</p>
        </div>
        
        <div>
            <h4 class="font-medium text-purple-300 mb-2">Prediction</h4>
            <p class="text-gray-200 leading-relaxed">${escapeHtml(pick.prediction)}</p>
        </div>
    `;
    return card;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg mb-4';
    errorDiv.innerHTML = `
        <div class="flex items-center">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
            </svg>
            ${message}
        </div>
    `;
    
    // Insert at the top of the picks container
    picksContainer.insertBefore(errorDiv, picksContainer.firstChild);
    
    // Remove after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.parentNode.removeChild(errorDiv);
        }
    }, 5000);
}

// Show success message
function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'bg-green-500/20 border border-green-500/50 text-green-300 px-4 py-3 rounded-lg mb-4';
    successDiv.innerHTML = `
        <div class="flex items-center">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
            </svg>
            ${message}
        </div>
    `;
    
    // Insert at the top of the picks container
    picksContainer.insertBefore(successDiv, picksContainer.firstChild);
    
    // Remove after 3 seconds
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.parentNode.removeChild(successDiv);
        }
    }, 3000);
}

// Load all picks from the server
async function loadPicks(page = 1) {
  try {
    const response = await fetch(`${API_BASE}/picks?page=${page}&limit=20`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    displayPicks(data.picks);
    updatePagination(data.pagination);
  } catch (error) {
    console.error('Error loading picks:', error);
    picksContainer.innerHTML = `
      <div class="text-center py-12">
        <div class="text-red-400 mb-4">
          <svg class="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
          </svg>
        </div>
        <h3 class="text-xl font-semibold mb-2">Failed to Load Picks</h3>
        <p class="text-gray-400 mb-4">There was an error loading the picks. Please try again later.</p>
        <button onclick="loadPicks()" class="btn-primary px-6 py-2 rounded-lg">
          Try Again
        </button>
      </div>
    `;
  }
}

// Load statistics
async function loadStats() {
  try {
    const response = await fetch(`${API_BASE}/stats`);
    if (response.ok) {
      const stats = await response.json();
      displayStats(stats);
    }
  } catch (error) {
    console.error('Error loading stats:', error);
  }
}

// Display statistics
function displayStats(stats) {
  const statsContainer = document.getElementById('statsContainer');
  if (!statsContainer) return;
  
  statsContainer.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="glass-effect rounded-xl p-6 text-center">
        <div class="text-3xl font-bold text-blue-400 mb-2">${stats.totalPicks}</div>
        <div class="text-gray-300">Total Picks</div>
      </div>
      <div class="glass-effect rounded-xl p-6 text-center">
        <div class="text-3xl font-bold text-purple-400 mb-2">${stats.totalUsers}</div>
        <div class="text-gray-300">Active Users</div>
      </div>
      <div class="glass-effect rounded-xl p-6 text-center">
        <div class="text-3xl font-bold text-green-400 mb-2">${stats.recentActivity}</div>
        <div class="text-gray-300">Active Today</div>
      </div>
      <div class="glass-effect rounded-xl p-6 text-center">
        <div class="text-3xl font-bold text-pink-400 mb-2">${Math.round(stats.totalPicks / Math.max(stats.totalUsers, 1))}</div>
        <div class="text-gray-300">Avg Picks/User</div>
      </div>
    </div>
  `;
}

// Update pagination
function updatePagination(pagination) {
  const paginationContainer = document.getElementById('paginationContainer');
  if (!paginationContainer) return;
  
  if (pagination.totalPages <= 1) {
    paginationContainer.innerHTML = '';
    return;
  }
  
  let paginationHTML = '<div class="flex justify-center items-center space-x-2 mt-8">';
  
  // Previous button
  if (pagination.hasPrev) {
    paginationHTML += `
      <button onclick="loadPicks(${pagination.page - 1})" 
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors">
        Previous
      </button>
    `;
  }
  
  // Page numbers
  const startPage = Math.max(1, pagination.page - 2);
  const endPage = Math.min(pagination.totalPages, pagination.page + 2);
  
  for (let i = startPage; i <= endPage; i++) {
    const isActive = i === pagination.page;
    paginationHTML += `
      <button onclick="loadPicks(${i})" 
              class="px-4 py-2 ${isActive ? 'bg-purple-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'} rounded-lg transition-colors">
        ${i}
      </button>
    `;
  }
  
  // Next button
  if (pagination.hasNext) {
    paginationHTML += `
      <button onclick="loadPicks(${pagination.page + 1})" 
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors">
        Next
      </button>
    `;
  }
  
  paginationHTML += '</div>';
  paginationContainer.innerHTML = paginationHTML;
}

// Display picks in the container
function displayPicks(picks) {
    if (picks.length === 0) {
        picksContainer.innerHTML = `
            <div class="text-center py-12">
                <div class="text-gray-400 mb-4">
                    <svg class="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                    </svg>
                </div>
                <h3 class="text-xl font-semibold mb-2">No Picks Yet</h3>
                <p class="text-gray-400">Be the first to submit a pick!</p>
            </div>
        `;
        return;
    }
    
    picksContainer.innerHTML = '';
    picks.forEach(pick => {
        const pickCard = createPickCard(pick);
        picksContainer.appendChild(pickCard);
    });
}

// Handle form submission
async function handleFormSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(pickForm);
    const pickData = {
        username: formData.get('username'),
        match: formData.get('match'),
        prediction: formData.get('prediction'),
        betting_code: formData.get('betting_code')
    };
    
    // Basic client-side validation
    if (!pickData.username.trim() || !pickData.match.trim() || !pickData.prediction.trim()) {
        showError('Please fill in all required fields.');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/picks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(pickData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to submit pick');
        }
        
        const newPick = await response.json();
        
        // Show success message
        showSuccess('Pick submitted successfully!');
        
        // Clear form
        pickForm.reset();
        
        // Reload picks to show the new one
        await loadPicks();
        
    } catch (error) {
        console.error('Error submitting pick:', error);
        showError(error.message || 'Failed to submit pick. Please try again.');
    }
}

// Initialize the application
function init() {
  // Load picks and stats when page loads
  loadPicks();
  loadStats();
  
  // Add form submit event listener
  pickForm.addEventListener('submit', handleFormSubmit);
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

