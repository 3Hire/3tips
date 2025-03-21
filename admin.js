const { createApp, ref, reactive, onMounted, computed } = Vue;

createApp({
    setup() {
        const title = ref('Admin Panel');
        const saveStatus = ref(null);
        const searchId = ref('');
        const isLoading = ref(false);
        const apiBaseUrl = 'http://localhost:3000/api/candidates';
        
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
            communication: ''
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
            
            try {
                isLoading.value = true;
                const response = await fetch(`${apiBaseUrl}/${encodeURIComponent(searchId.value.trim())}`);
                
                if (response.status === 404) {
                    saveStatus.value = {
                        type: 'error',
                        message: 'No candidate found matching: ' + searchId.value
                    };
                    setTimeout(() => { saveStatus.value = null; }, 3000);
                    return;
                }
                
                if (!response.ok) throw new Error('Failed to fetch candidate');
                
                const data = await response.json();
                loadCandidateData(data);
                
                saveStatus.value = {
                    type: 'success',
                    message: 'Candidate profile loaded!'
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
                const response = await fetch(`${apiBaseUrl}/${candidateId}`);
                if (!response.ok) throw new Error('Failed to fetch candidate');
                
                const data = await response.json();
                loadCandidateData(data);
                searchId.value = candidateId;
                
                saveStatus.value = {
                    type: 'success',
                    message: 'Candidate profile loaded!'
                };
                setTimeout(() => { saveStatus.value = null; }, 3000);
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
            Object.keys(profile).forEach(key => {
                if (key in data) {
                    profile[key] = data[key];
                }
            });
            
            // Ensure all fields exist
            ['timing', 'facial', 'video', 'communication'].forEach(field => {
                if (!profile[field]) {
                    profile[field] = '';
                }
            });
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
        
        // Copy the access key to clipboard
        function copyAccessKey() {
            // Create a temporary input element
            const tempInput = document.createElement('input');
            tempInput.value = profile.accessKey;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            
            saveStatus.value = {
                type: 'success',
                message: 'Access key copied to clipboard!'
            };
            setTimeout(() => { saveStatus.value = null; }, 2000);
        }
        
        // Email report access details to the candidate
        async function emailReportAccess() {
            if (!profile.email || !profile.id || !profile.accessKey) {
                saveStatus.value = {
                    type: 'error',
                    message: 'Missing candidate information. Please ensure the candidate has a valid email.'
                };
                setTimeout(() => { saveStatus.value = null; }, 3000);
                return;
            }
            
            try {
                isLoading.value = true;
                const response = await fetch(`${apiBaseUrl}/${profile.id}/emailAccess`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: profile.name,
                        email: profile.email,
                        candidateId: profile.id,
                        accessKey: profile.accessKey
                    })
                });
                
                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.message || 'Failed to send email');
                }
                
                const data = await response.json();
                
                saveStatus.value = {
                    type: 'success',
                    message: 'Email sent successfully to ' + profile.email
                };
                setTimeout(() => { saveStatus.value = null; }, 3000);
            } catch (error) {
                console.error('Error sending email:', error);
                saveStatus.value = {
                    type: 'error',
                    message: 'Error sending email: ' + error.message
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
            copyAccessKey,
            emailReportAccess,
            regenerateProfileUrl
        };
    }
}).mount('#admin-app');