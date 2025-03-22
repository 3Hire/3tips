// Make sure Vue is defined
if (typeof Vue === 'undefined') {
    console.error('Vue is not loaded! Check your script includes.');
}

// Extract Vue methods
const { createApp, ref, reactive, onMounted, computed } = Vue;

// Create the Vue app and store it in a global variable for debugging
window.app = createApp({
    setup() {
        const title = ref('Admin Panel');
        const saveStatus = ref(null);
        const searchId = ref('');
        const isLoading = ref(false);
        // Dynamically determine API base URL based on current domain
        function getApiBaseUrl() {
            const protocol = window.location.protocol;
            const hostname = window.location.hostname;
            // Only add port for localhost development
            const port = (hostname === 'localhost' || hostname === '127.0.0.1') ? ':3000' : '';
            return `${protocol}//${hostname}${port}/api/candidates`;
        }
        
        // Get the API base URL
        const apiBaseUrl = getApiBaseUrl();
        
        // Log the API base URL for debugging
        console.log('Admin panel initialized with API URL:', apiBaseUrl);
        
        // Computed properties for validation
        const isValidEmail = computed(() => {
            if (!profile.email) return true; // Empty is allowed for computed (required handles that)
            return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(profile.email);
        });
        
        const isValidPhone = computed(() => {
            if (!profile.phone) return true; // Empty is allowed
            return /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(profile.phone);
        });
        
        const isValidLinkedIn = computed(() => {
            if (!profile.linkedin) return true; // Empty is allowed
            return profile.linkedin.includes('linkedin.com/');
        });
        
        const isFormValid = computed(() => {
            return profile.name && 
                   isValidEmail.value && 
                   isValidPhone.value && 
                   isValidLinkedIn.value;
        });
        
        // Initialize profile data structure
        const profile = reactive({
            id: '',
            accessKey: '',  // Hidden from UI but stored in database
            accessUrl: '',  // Shareable URL
            name: '',
            linkedin: '',
            email: '',
            phone: '',
            summary: '',
            timing: '',
            facial: '',
            video: '',
            communication: '',
            recommendations: '',
            isUnlocked: false
        });
        
        // Get list of candidates
        const candidatesList = ref([]);
        
        // Load candidates list from the API
        const loadCandidatesList = async () => {
            try {
                isLoading.value = true;
                const response = await fetch(apiBaseUrl);
                if (!response.ok) throw new Error('Failed to fetch candidates');
                const data = await response.json();
                candidatesList.value = data;
            } catch (error) {
                console.error('Error loading candidates:', error);
                saveStatus.value = {
                    type: 'error',
                    message: 'Failed to load candidates: ' + error.message
                };
                setTimeout(() => { saveStatus.value = null; }, 3000);
            } finally {
                isLoading.value = false;
            }
        };
        
        // Initialize on mount
        onMounted(() => {
            loadCandidatesList();
        });
        
        // Add a new item to a list (strengths, weaknesses, skills)
        function addItem(listName) {
            profile[listName].push('');
        }
        
        // Remove an item from a list
        function removeItem(listName, index) {
            profile[listName].splice(index, 1);
            // Make sure there's always at least one empty field
            if (profile[listName].length === 0) {
                profile[listName].push('');
            }
        }
        
        // Generate a unique ID for new candidates
        function generateUniqueId() {
            return 'CAN-' + Date.now().toString().slice(-6);
        }
        
        // Search for a candidate by ID, name, email, phone, or LinkedIn
        async function searchCandidate() {
            if (!searchId.value.trim()) {
                saveStatus.value = {
                    type: 'error',
                    message: 'Please enter a search term (ID, name, email, phone, or LinkedIn)'
                };
                setTimeout(() => { saveStatus.value = null; }, 3000);
                return;
            }
            
            const searchTerm = searchId.value.trim();
            isLoading.value = true;
            
            try {
                // Try API search first
                try {
                    const searchUrl = `${apiBaseUrl}/${encodeURIComponent(searchTerm)}`;
                    console.log('Searching API at:', searchUrl);
                    
                    // Use more reliable fetch options
                    const response = await fetch(searchUrl, {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        mode: 'cors',
                        cache: 'no-cache',
                        credentials: 'same-origin'
                    });
                    
                    console.log('API Response status:', response.status);
                    const responseText = await response.text();
                    console.log('API Response text:', responseText);
                    
                    if (response.ok) {
                        try {
                            const data = JSON.parse(responseText);
                            console.log('Parsed data:', data);
                            
                            // Debug what fields are available
                            console.log('Data fields available:', Object.keys(data));
                            
                            // Load the data into the form
                            loadCandidateData(data);
                            
                            // Update the candidatesList if this candidate isn't already in it
                            const existsInList = candidatesList.value.some(c => c.id === data.id);
                            if (!existsInList) {
                                candidatesList.value.push({
                                    id: data.id,
                                    name: data.name
                                });
                            }
                            
                            saveStatus.value = {
                                type: 'success',
                                message: 'Candidate profile loaded!'
                            };
                            setTimeout(() => { saveStatus.value = null; }, 3000);
                            return;
                        } catch (parseError) {
                            console.error('Error parsing JSON response:', parseError);
                            throw new Error('Error parsing server response: ' + parseError.message);
                        }
                    } else {
                        console.warn('API returned non-OK status:', response.status);
                        if (response.status === 404) {
                            throw new Error('No candidate found matching: ' + searchTerm);
                        } else {
                            throw new Error('API error: ' + response.status);
                        }
                    }
                } catch (apiError) {
                    console.warn('API search failed, trying fallback:', apiError);
                    throw apiError; // Re-throw to handle in the outer catch
                }
                
                // Check if this candidate was unlocked locally (localStorage)
                const isIdMatch = searchTerm.match(/^CAN-\d+$/i);
                if (isIdMatch) {
                    const isUnlocked = localStorage.getItem(`candidate_${searchTerm}_unlocked`) === 'true';
                    
                    // Create a mock candidate with ID and unlock status
                    const mockCandidate = {
                        id: searchTerm,
                        name: searchTerm.replace('CAN-', 'Candidate '),
                        email: '',
                        phone: '',
                        linkedin: '',
                        summary: '',
                        recommendations: '',
                        isUnlocked: isUnlocked
                    };
                    
                    loadCandidateData(mockCandidate);
                    
                    saveStatus.value = {
                        type: 'warning',
                        message: 'Database unavailable. Loaded local data.'
                    };
                    setTimeout(() => { saveStatus.value = null; }, 3000);
                    return;
                }
                
                // No data found
                saveStatus.value = {
                    type: 'error',
                    message: 'No candidate found matching: ' + searchTerm
                };
                setTimeout(() => { saveStatus.value = null; }, 3000);
                
            } catch (error) {
                console.error('Error searching candidate:', error);
                saveStatus.value = {
                    type: 'error',
                    message: 'Error searching candidate: ' + error.message
                };
                setTimeout(() => { saveStatus.value = null; }, 3000);
            } finally {
                isLoading.value = false;
            }
        }
        
        // Load a candidate profile by ID
        async function loadCandidate(candidateId) {
            try {
                isLoading.value = true;
                const loadUrl = `${apiBaseUrl}/${encodeURIComponent(candidateId)}`;
                console.log('Loading candidate from API:', loadUrl);
                
                const response = await fetch(loadUrl, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    mode: 'cors',
                    cache: 'no-cache',
                    credentials: 'same-origin'
                });
                console.log('Load response status:', response.status);
                
                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error('Candidate not found: ' + candidateId);
                    } else {
                        throw new Error('Failed to fetch candidate: Server returned ' + response.status);
                    }
                }
                
                try {
                    // Get the response as text first for debugging
                    const responseText = await response.text();
                    console.log('Raw response:', responseText);
                    
                    // Parse the text into JSON
                    const data = JSON.parse(responseText);
                    console.log('Loaded candidate data:', data);
                    
                    // Debug what fields are available
                    console.log('Data fields available:', Object.keys(data));
                    
                    // Load the data into the form
                    loadCandidateData(data);
                    searchId.value = candidateId;
                    
                    saveStatus.value = {
                        type: 'success',
                        message: 'Candidate profile loaded!'
                    };
                    setTimeout(() => { saveStatus.value = null; }, 3000);
                } catch (parseError) {
                    console.error('Error parsing server response:', parseError);
                    throw new Error('Invalid response format from server: ' + parseError.message);
                }
            } catch (error) {
                console.error('Error loading candidate:', error);
                saveStatus.value = {
                    type: 'error',
                    message: 'Error loading candidate: ' + error.message
                };
                setTimeout(() => { saveStatus.value = null; }, 3000);
            } finally {
                isLoading.value = false;
            }
        }
        
        // Helper function to load candidate data into the form
        function loadCandidateData(data) {
            console.log('Loading candidate data into form:', data);
            
            // Map all fields from data to profile
            Object.keys(profile).forEach(key => {
                if (key in data) {
                    console.log(`Setting profile.${key} = ${data[key]}`);
                    profile[key] = data[key];
                } else {
                    console.log(`Field ${key} not found in data`);
                }
            });
            
            // Set default values for missing fields
            const requiredFields = ['id', 'name', 'email', 'accessKey', 'isUnlocked'];
            requiredFields.forEach(field => {
                if (!profile[field] && field in data) {
                    console.log(`Setting required field ${field} from data`);
                    profile[field] = data[field];
                }
            });
            
            // Ensure all optional fields exist with at least empty strings
            ['timing', 'facial', 'video', 'communication', 'summary', 'recommendations', 
             'linkedin', 'phone', 'accessUrl'].forEach(field => {
                if (!profile[field]) {
                    console.log(`Initializing empty field: ${field}`);
                    profile[field] = '';
                }
            });
            
            // Double check isUnlocked is properly set
            if (typeof profile.isUnlocked !== 'boolean') {
                profile.isUnlocked = Boolean(data.isUnlocked);
                console.log(`Fixed isUnlocked type: ${profile.isUnlocked}`);
            }
            
            console.log('Updated profile:', {...profile});
        }
        
        // Start a new candidate profile
        function newCandidate() {
            // Reset the form
            profile.id = generateUniqueId();
            profile.name = '';
            profile.linkedin = '';
            profile.email = '';
            profile.phone = '';
            profile.summary = '';
            profile.timing = '';
            profile.facial = '';
            profile.video = '';
            profile.communication = '';
            searchId.value = '';
            
            saveStatus.value = {
                type: 'success',
                message: 'New candidate profile created! ID: ' + profile.id
            };
            setTimeout(() => { saveStatus.value = null; }, 3000);
        }
        
        // Delete a candidate profile
        async function deleteCandidate(candidateId) {
            if (confirm('Are you sure you want to delete this candidate profile?')) {
                try {
                    isLoading.value = true;
                    const response = await fetch(`${apiBaseUrl}/${candidateId}`, {
                        method: 'DELETE'
                    });
                    
                    if (!response.ok) throw new Error('Failed to delete candidate');
                    
                    // Update the local list
                    candidatesList.value = candidatesList.value.filter(c => c.id !== candidateId);
                    
                    // Reset form if the current profile is the one being deleted
                    if (profile.id === candidateId) {
                        resetForm();
                    }
                    
                    saveStatus.value = {
                        type: 'success',
                        message: 'Candidate profile deleted!'
                    };
                    setTimeout(() => { saveStatus.value = null; }, 3000);
                } catch (error) {
                    console.error('Error deleting candidate:', error);
                    saveStatus.value = {
                        type: 'error',
                        message: 'Error deleting candidate: ' + error.message
                    };
                    setTimeout(() => { saveStatus.value = null; }, 3000);
                } finally {
                    isLoading.value = false;
                }
            }
        }
        
        // Save profile data to the API
        async function saveProfile() {
            try {
                // Form validation
                if (!profile.name) {
                    throw new Error('Full name is required');
                }
                
                if (!isValidEmail.value) {
                    throw new Error('Please enter a valid email address');
                }
                
                if (profile.phone && !isValidPhone.value) {
                    throw new Error('Please enter a valid phone number');
                }
                
                if (profile.linkedin && !isValidLinkedIn.value) {
                    throw new Error('Please enter a valid LinkedIn URL (should contain linkedin.com/)');
                }
                
                if (!profile.id) {
                    profile.id = generateUniqueId();
                }
                
                isLoading.value = true;
                
                // Clone the profile and clean up data
                const cleanProfile = JSON.parse(JSON.stringify(profile));
                
                // No need to filter arrays anymore
                
                // Determine if this is a new candidate or an update
                const isExisting = candidatesList.value.some(c => c.id === cleanProfile.id);
                const method = isExisting ? 'PUT' : 'POST';
                const url = isExisting 
                    ? `${apiBaseUrl}/${cleanProfile.id}` 
                    : apiBaseUrl;
                
                const response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(cleanProfile)
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    
                    // Handle MongoDB duplicate key errors (code 11000)
                    if (errorData.message && errorData.message.includes('duplicate key error')) {
                        let field = 'a field';
                        if (errorData.message.includes('email')) field = 'email';
                        if (errorData.message.includes('phone')) field = 'phone number';
                        if (errorData.message.includes('linkedin')) field = 'LinkedIn URL';
                        
                        throw new Error(`Duplicate ${field}. Another candidate is already using this ${field}.`);
                    } else if (errorData.message && errorData.message.includes('validation failed')) {
                        throw new Error(errorData.message);
                    } else {
                        throw new Error('Failed to save candidate: ' + errorData.message);
                    }
                }
                
                const savedData = await response.json();
                
                // Update or add to the local list
                if (isExisting) {
                    const index = candidatesList.value.findIndex(c => c.id === savedData.id);
                    if (index >= 0) {
                        candidatesList.value[index] = {
                            id: savedData.id,
                            name: savedData.name
                        };
                    }
                } else {
                    candidatesList.value.push({
                        id: savedData.id,
                        name: savedData.name
                    });
                }
                
                // Update search field with current ID
                searchId.value = savedData.id;
                
                // Show success message
                saveStatus.value = {
                    type: 'success',
                    message: `Profile ${isExisting ? 'updated' : 'saved'} successfully! ID: ${savedData.id}`
                };
                
                // Clear success message after 3 seconds
                setTimeout(() => {
                    saveStatus.value = null;
                }, 3000);
            } catch (error) {
                // Show error message
                console.error('Error saving profile:', error);
                saveStatus.value = {
                    type: 'error',
                    message: 'Error saving profile: ' + error.message
                };
                setTimeout(() => { saveStatus.value = null; }, 3000);
            } finally {
                isLoading.value = false;
            }
        }
        
        // Reset form to blank state
        function resetForm() {
            profile.id = '';
            profile.name = '';
            profile.linkedin = '';
            profile.email = '';
            profile.phone = '';
            profile.summary = '';
            profile.timing = '';
            profile.facial = '';
            profile.video = '';
            profile.communication = '';
            profile.recommendations = '';
            searchId.value = '';
        }
        
        // Get the full URL to the candidate's profile
        function getFullProfileUrl() {
            if (!profile.accessUrl) return '';
            // Using window.location to get the base URL dynamically
            return `${window.location.protocol}//${window.location.host}/${profile.accessUrl}`;
        }
        
        // Copy the URL to clipboard
        function copyUrlToClipboard() {
            const urlInput = document.querySelector('.url-input');
            urlInput.select();
            document.execCommand('copy');
            
            saveStatus.value = {
                type: 'success',
                message: 'URL copied to clipboard!'
            };
            setTimeout(() => { saveStatus.value = null; }, 2000);
        }
        
        // Copy all access information to clipboard
        function copyAllAccessInfo() {
            // Create formatted text with all access information
            const reportUrl = 'http://localhost:3000/candidates.html';
            const allAccessInfo = 
                `Report URL: ${reportUrl}\n` +
                `Candidate ID: ${profile.id}\n` +
                `Access Key: ${profile.accessKey}`;
            
            // Create a temporary input element
            const tempInput = document.createElement('textarea');
            tempInput.value = allAccessInfo;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            
            saveStatus.value = {
                type: 'success',
                message: 'All access information copied to clipboard!'
            };
            setTimeout(() => { saveStatus.value = null; }, 2000);
        }
        
        // Open default email client with pre-composed report access email
        function emailReportAccess() {
            if (!profile.email || !profile.id || !profile.accessKey) {
                saveStatus.value = {
                    type: 'error',
                    message: 'Missing candidate information. Please ensure the candidate has a valid email.'
                };
                setTimeout(() => { saveStatus.value = null; }, 3000);
                return;
            }
            
            try {
                // Construct the email content
                const subject = encodeURIComponent("Interview Report from 3Hire");
                // Use the getApiBaseUrl function but adjust for candidates.html
                const baseUrl = getApiBaseUrl().replace('/api/candidates', '');
                const reportUrl = `${baseUrl}/candidates.html`;
                
                // Format the candidate's name properly
                let candidateName = profile.name || '';
                if (candidateName) {
                    // Capitalize first letter of each word
                    candidateName = candidateName.split(' ')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                        .join(' ');
                }
                
                // Construct email body with proper formatting
                const body = encodeURIComponent(`Dear ${candidateName},

We're pleased to inform you that your interview assessment report is now ready for your review.

To access your report, please visit:
${reportUrl}

You will need the following credentials:
Candidate ID: ${profile.id}
Access Key: ${profile.accessKey}

This report provides valuable insights into your interview performance and offers recommendations for your professional development.

If you have any questions or need further assistance, please don't hesitate to reach out.

Best regards,
Team 3Hire
www.3hire.ai
`);
                
                // Open default email client with pre-composed email
                window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
                
                saveStatus.value = {
                    type: 'success',
                    message: 'Email client opened with pre-composed message'
                };
                setTimeout(() => { saveStatus.value = null; }, 3000);
            } catch (error) {
                console.error('Error opening email client:', error);
                saveStatus.value = {
                    type: 'error',
                    message: 'Error opening email client: ' + error.message
                };
                setTimeout(() => { saveStatus.value = null; }, 3000);
            }
        }
        
        // Unlock recommendations for a candidate
        async function unlockRecommendations() {
            if (!profile.id) return;
            
            try {
                isLoading.value = true;
                
                // Always update the local state immediately for better UX
                profile.isUnlocked = true;
                
                // Try to update the database
                try {
                    const response = await fetch(`${apiBaseUrl}/${profile.id}/unlock`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    
                    if (response.ok) {
                        const data = await response.json();
                        console.log('Database updated successfully:', data);
                    } else {
                        console.warn('API call to unlock candidate failed, but UI was updated');
                    }
                } catch (apiError) {
                    console.warn('API call to unlock candidate failed, but UI was updated:', apiError);
                }
                
                // Store in localStorage as a backup/fallback
                try {
                    localStorage.setItem(`candidate_${profile.id}_unlocked`, 'true');
                } catch (storageError) {
                    console.warn('Failed to store unlock status in localStorage:', storageError);
                }
                
                saveStatus.value = {
                    type: 'success',
                    message: 'Recommendations unlocked successfully!'
                };
                setTimeout(() => { saveStatus.value = null; }, 3000);
            } catch (error) {
                console.error('Error unlocking recommendations:', error);
                saveStatus.value = {
                    type: 'error',
                    message: 'Error unlocking recommendations: ' + error.message
                };
                setTimeout(() => { saveStatus.value = null; }, 3000);
            } finally {
                isLoading.value = false;
            }
        }
        
        // Regenerate profile URL
        async function regenerateProfileUrl() {
            if (!profile.id) return;
            
            try {
                isLoading.value = true;
                const response = await fetch(`${apiBaseUrl}/${profile.id}/regenerateAccess`, {
                    method: 'POST'
                });
                
                if (!response.ok) throw new Error('Failed to regenerate URL');
                
                const data = await response.json();
                profile.accessUrl = data.url;
                
                saveStatus.value = {
                    type: 'success',
                    message: 'New profile URL generated successfully!'
                };
                setTimeout(() => { saveStatus.value = null; }, 3000);
            } catch (error) {
                console.error('Error regenerating URL:', error);
                saveStatus.value = {
                    type: 'error',
                    message: 'Error regenerating URL: ' + error.message
                };
                setTimeout(() => { saveStatus.value = null; }, 3000);
            } finally {
                isLoading.value = false;
            }
        }
        
        return {
            title,
            profile,
            saveStatus,
            searchId,
            isLoading,
            candidatesList,
            isValidEmail,
            isValidPhone,
            isValidLinkedIn,
            isFormValid,
            addItem,
            removeItem,
            saveProfile,
            resetForm,
            searchCandidate,
            loadCandidate,
            newCandidate,
            deleteCandidate,
            getFullProfileUrl,
            copyUrlToClipboard,
            copyAllAccessInfo,
            emailReportAccess,
            unlockRecommendations,
            regenerateProfileUrl
        };
    }
});

// Delay mounting until DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, mounting Vue app to #admin-app');
    try {
        window.app.mount('#admin-app');
        console.log('Vue app mounted successfully');
    } catch (e) {
        console.error('Failed to mount Vue app:', e);
    }
});