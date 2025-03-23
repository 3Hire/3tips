// Admin panel functionality
document.addEventListener('DOMContentLoaded', function() {
    const { ref, onMounted } = Vue;
    
    const AdminApp = {
        setup() {
            // State
            const candidate = ref({
                name: '',
                email: '',
                phone: '',
                linkedin: '',
                summary: '',
                recommendations: ''
            });
            const isEditing = ref(false);
            const searchQuery = ref('');
            const searchResult = ref(null);
            const validationErrors = ref({});
            const saveStatus = ref({ message: '', type: '' });
            const lastCreatedCandidate = ref({});
            
            // Get the API base URL
            const getApiBaseUrl = () => {
                const protocol = window.location.protocol;
                const hostname = window.location.hostname;
                const port = (hostname === 'localhost' || hostname === '127.0.0.1') ? ':3000' : '';
                return `${protocol}//${hostname}${port}/api`;
            };
            
            // Search for a candidate
            const searchCandidate = async () => {
                if (!searchQuery.value) {
                    showStatus('Please enter a search term', 'error');
                    return;
                }
                
                try {
                    const response = await fetch(`${getApiBaseUrl()}/candidates/search?q=${encodeURIComponent(searchQuery.value)}`);
                    
                    if (response.ok) {
                        const results = await response.json();
                        
                        if (results.length > 0) {
                            // Get the first match
                            await loadCandidate(results[0].id);
                        } else {
                            searchResult.value = null;
                            showStatus('No candidate found', 'error');
                        }
                    } else {
                        handleApiError(response);
                    }
                } catch (error) {
                    console.error('Error searching candidate:', error);
                    fallbackToLocalSearch();
                }
            };
            
            // Fallback to local search for demo purposes
            const fallbackToLocalSearch = () => {
                showStatus('API unavailable, using demo mode', 'error');
                
                // Demo data
                const demoData = [
                    {
                        id: 'CAN-574395',
                        name: 'John Sample',
                        email: 'john.sample@example.com',
                        phone: '555-123-4567',
                        linkedin: 'https://linkedin.com/in/johnsample',
                        summary: 'John demonstrated strong analytical skills during the interview. He articulated his thoughts clearly and showed good problem-solving abilities.',
                        recommendations: 'Areas for improvement: Work on providing more concise answers to questions. Strengthen technical knowledge in specific areas.',
                        accessCode: '8b17879f434b7adc',
                        isUnlocked: false
                    },
                    {
                        id: 'CAN-976734',
                        name: 'Emma Sample',
                        email: 'emma.sample@example.com',
                        phone: '555-987-6543',
                        linkedin: 'https://linkedin.com/in/emmasample',
                        summary: 'Emma showed exceptional leadership qualities and project management experience. She provided concrete examples of past achievements.',
                        recommendations: 'Areas for improvement: Develop more detailed responses about technical implementation details. Prepare more specific examples of how you\'ve handled challenges.',
                        accessCode: 'c5f3e9b821a6d794',
                        isUnlocked: false
                    }
                ];
                
                const query = searchQuery.value.toLowerCase();
                const result = demoData.find(c => 
                    c.id.toLowerCase().includes(query) || 
                    c.name.toLowerCase().includes(query) || 
                    c.email.toLowerCase().includes(query)
                );
                
                if (result) {
                    searchResult.value = result;
                    candidate.value = { ...result };
                    isEditing.value = true;
                    showStatus('Candidate found (demo mode)', 'success');
                } else {
                    searchResult.value = null;
                    showStatus('No candidate found', 'error');
                }
            };
            
            // Load a specific candidate by ID
            const loadCandidate = async (id) => {
                try {
                    const response = await fetch(`${getApiBaseUrl()}/candidates/${id}`);
                    
                    if (response.ok) {
                        const data = await response.json();
                        searchResult.value = {
                            id: data.id,
                            name: data.name,
                            accessCode: data.accessCode
                        };
                        candidate.value = { ...data };
                        isEditing.value = true;
                        showStatus('Candidate loaded successfully', 'success');
                    } else {
                        handleApiError(response);
                    }
                } catch (error) {
                    console.error('Error loading candidate:', error);
                    showStatus('Error loading candidate: ' + error.message, 'error');
                }
            };
            
            // Save the candidate
            const saveCandidate = async () => {
                // Validate the form
                if (!validateForm()) {
                    return;
                }
                
                try {
                    let response;
                    let method;
                    let url;
                    
                    if (isEditing.value) {
                        // Update existing candidate
                        method = 'PUT';
                        url = `${getApiBaseUrl()}/candidates/${candidate.value.id}`;
                    } else {
                        // Create new candidate
                        method = 'POST';
                        url = `${getApiBaseUrl()}/candidates`;
                    }
                    
                    response = await fetch(url, {
                        method: method,
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(candidate.value)
                    });
                    
                    if (response.ok) {
                        const data = await response.json();
                        
                        if (!isEditing.value) {
                            // Store the last created candidate info to display
                            lastCreatedCandidate.value = {
                                id: data.id,
                                accessCode: data.accessCode
                            };
                            resetForm();
                        } else {
                            // Update the search result display
                            searchResult.value = {
                                id: data.id,
                                name: data.name,
                                accessCode: data.accessCode
                            };
                            candidate.value = { ...data };
                        }
                        
                        showStatus(
                            `Candidate ${isEditing.value ? 'updated' : 'created'} successfully`, 
                            'success'
                        );
                    } else {
                        handleApiError(response);
                    }
                } catch (error) {
                    console.error('Error saving candidate:', error);
                    fallbackToLocalSave();
                }
            };
            
            // Fallback to local save for demo purposes
            const fallbackToLocalSave = () => {
                showStatus('API unavailable, using demo mode', 'error');
                
                if (isEditing.value) {
                    // Just show success in demo mode
                    showStatus('Candidate updated successfully (demo mode)', 'success');
                } else {
                    // Generate unique ID and access code
                    const uniqueId = generateUniqueId();
                    const accessCode = generateAccessCode(16);
                    
                    // Store the last created candidate info to display
                    lastCreatedCandidate.value = {
                        id: uniqueId,
                        accessCode: accessCode
                    };
                    
                    showStatus('Candidate created successfully (demo mode)', 'success');
                    resetForm();
                }
            };
            
            // Handle API errors
            const handleApiError = async (response) => {
                try {
                    const error = await response.json();
                    showStatus(`Error: ${error.msg || 'Unknown error'}`, 'error');
                } catch (e) {
                    showStatus(`Error: ${response.statusText || 'Unknown error'}`, 'error');
                }
            };
            
            // Validate the form
            const validateForm = () => {
                validationErrors.value = {};
                
                if (!candidate.value.name || candidate.value.name.trim() === '') {
                    validationErrors.value.name = 'Name is required';
                }
                
                if (!candidate.value.email || candidate.value.email.trim() === '') {
                    validationErrors.value.email = 'Email is required';
                } else if (!isValidEmail(candidate.value.email)) {
                    validationErrors.value.email = 'Please enter a valid email address';
                }
                
                if (!candidate.value.summary || candidate.value.summary.trim() === '') {
                    validationErrors.value.summary = 'Interview summary is required';
                }
                
                return Object.keys(validationErrors.value).length === 0;
            };
            
            // Helper to validate email
            const isValidEmail = (email) => {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            };
            
            // Helper to generate a unique ID (only used in fallback mode)
            const generateUniqueId = () => {
                return 'CAN-' + Math.floor(100000 + Math.random() * 900000);
            };
            
            // Helper to generate a random access code (only used in fallback mode)
            const generateAccessCode = (length) => {
                const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
                let result = '';
                for (let i = 0; i < length; i++) {
                    result += chars.charAt(Math.floor(Math.random() * chars.length));
                }
                return result;
            };
            
            // Helper to show status messages
            const showStatus = (message, type) => {
                saveStatus.value = { message, type };
                setTimeout(() => {
                    if (saveStatus.value.message === message) {
                        saveStatus.value = { message: '', type: '' };
                    }
                }, 3000);
            };
            
            // Reset the form
            const resetForm = () => {
                candidate.value = {
                    name: '',
                    email: '',
                    phone: '',
                    linkedin: '',
                    summary: '',
                    recommendations: ''
                };
                isEditing.value = false;
                validationErrors.value = {};
                searchResult.value = null;
            };
            
            return {
                candidate,
                isEditing,
                searchQuery,
                searchResult,
                validationErrors,
                saveStatus,
                lastCreatedCandidate,
                searchCandidate,
                saveCandidate,
                resetForm
            };
        }
    };
    
    // Mount the Vue app
    Vue.createApp(AdminApp).mount('#admin-app');
});