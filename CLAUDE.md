# 3tips Project Documentation

## Project Structure
- React web application with main app in root directory
- Separate frontend-chatbot project in subdirectory
- Multiple image assets in various formats
- Component-based architecture

### Main Application Components
- Home page and navigation
- Service components:
  - CareerGym (coaching services - Coaching.js)
  - Feedback system (original CareerGym.js)
  - HiringBar (DeepMatch.js)
  - SuccessStories
- Admin interface and AddEntry for data management
- Contact and About pages
- Multiple modal components:
  - AgreementModal (for feedback access)
  - CareerTransitionModal (for career transition service payment)
  - CoachingModal (for 1-1 coaching session booking)
  - DonateModal (for donations)
  - RequestFeedbackModal (for requesting interview feedback)

### Key Technologies
- React.js
- AWS (DynamoDB integration via dynamo.js)
- CSS for styling

## CRITICAL: Image Path Patterns

### ✅ WORKING PATTERNS (DO NOT CHANGE):
1. **JavaScript background images**: Use `import imageName from "../images/filename.jpg"` then `url(${imageName})`
   - Example: Home.js, HiringBar.js, Admin.js, Coaching.js
   - These images must exist in `/src/images/` folder

2. **HTML img src and CSS background-image**: Use `/images/filename.jpg` paths
   - Example: About.js slideshow, Logo.js component  
   - These images must exist in `/public/images/` folder

### ❌ NEVER USE:
- `/images/` paths in JavaScript `document.body.style.backgroundImage`
- Direct imports from `/public/images/` folder
- Changing working components

### Image Storage:
- **Keep `/src/images/`**: For JavaScript imports (background images)
- **Keep `/public/images/`**: For HTML src and CSS references
- **Both folders needed**: Do not delete either folder

## Recent Changes (May 2025)

### New Pages and Features
- Added CareerGym services page (Coaching.js) with three service options:
  - Jobseekers Support (donation-based)
  - Career Transition (featured, $99/month)
  - 1-1 Coaching ($99/30 minutes)
- Created CareerTransitionModal with QR code payment
- Updated all modals with consistent contact information and email links
- Fixed router configuration to ensure proper navigation

### Rebranding and Navigation Updates
- Renamed "Coaching" to "CareerGym" in navigation menu
- Updated homepage button to direct "Start CareerGym" to the coaching services page
- Maintained original CareerGym page (for feedback) but removed from navigation
- Added highlighted contact message in all payment modals

### UI Improvements
- Improved horizontal alignment of service cards
- Set Career Transition as the middle featured option
- Added styling for email links in all modals
- Fixed QR code image display in CareerTransitionModal

### Cleanup
- Removed duplicate 3tips directory
- Removed unused frontend-chatbot directory

## File Structure Reference

### Key Files
- `/src/App.js` - Main application routes and navigation
- `/src/components/Home.js` - Homepage with intro and main buttons
- `/src/components/Coaching.js` - CareerGym services page (renamed to CareerGym in UI)
- `/src/components/CareerGym.js` - Original feedback system (hidden from navigation)
- `/src/components/CareerTransitionModal.js` - Modal for Career Transition service
- `/src/components/CoachingModal.js` - Modal for 1-1 coaching bookings
- `/src/components/DonateModal.js` - Modal for donations

### Asset Locations
- React components located in `/src/components/`
- Component CSS files alongside their respective JS files
- Image assets in `/public/images/` and `/src/images/`
- API integration in `/src/api/`
- QR code payment images in `/public/images/`