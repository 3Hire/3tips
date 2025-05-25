# 3tips Project Documentation

## Project Structure
- React web application with main app in root directory
- Separate frontend-chatbot project in subdirectory
- Multiple image assets in various formats
- Component-based architecture

### Main Application Components
- Home page and navigation
- Service components (DeepView, DeepMatch, CareerGym, HiringBar)
- Admin interface
- Contact and About pages
- Multiple modal components (Agreement, Coaching, Donate, RequestFeedback)

### Key Technologies
- React.js
- AWS (DynamoDB integration via dynamo.js)
- CSS for styling

## Recent Changes
- Fixed button alignment in RequestFeedbackModal
- Improved vertical centering on CareerGym and HiringBar pages
- Added functional links for Donate and Book buttons in footer
- Made footer buttons more compact
- Added Donate and Book buttons to footer

## File Structure Reference
Main application components located in `/src/components/`
Image assets in `/public/images/` and `/src/images/`
API integration in `/src/api/`