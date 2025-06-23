# Profile Page Feature

This document describes the new user profile page that allows users to view and edit their personal information.

## Features

### 1. Protected Route
- The profile page is protected and requires authentication
- Users without a valid JWT token will be redirected to the login page
- Uses the existing `ProtectedRoute` component

### 2. Profile Information Display
- Shows user's full name, email, and role
- Role is displayed as read-only (cannot be changed by users)
- Password field is hidden for security

### 3. Profile Editing
- Users can edit their full name, email, and password
- All fields are optional during updates
- Password field is optional - leaving it blank keeps the current password
- Form validation ensures proper email format and password strength

### 4. User Experience
- Clean, modern UI with Tailwind CSS
- Loading states during API calls
- Success and error message displays
- Responsive design for mobile and desktop
- Edit mode toggle with save/cancel actions

## API Integration

### User Profile API (`/src/app/utils/apis/user.ts`)
- `getUserProfile()` - Fetches current user's profile
- `updateUserProfile(userData)` - Updates user profile information
- TypeScript interfaces for type safety

### API Endpoints Used
- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update user profile

## Navigation Integration

### Updated Navigation Component
- Added "Profile" link in desktop navigation
- Added "Profile" link in mobile navigation menu
- Links are only visible for authenticated users

## File Structure

```
src/app/
├── profile/
│   └── page.tsx              # Main profile page component
├── utils/apis/
│   └── user.ts               # User API functions
└── components/
    └── Navigation.tsx        # Updated with profile links
```

## Usage

1. **Access Profile Page**: Click "Profile" in the navigation menu
2. **View Information**: Profile information is displayed in read-only mode
3. **Edit Profile**: Click "Edit Profile" button to enable editing
4. **Make Changes**: Modify full name, email, and/or password
5. **Save Changes**: Click "Save Changes" to update profile
6. **Cancel**: Click "Cancel" to discard changes and return to view mode

## Security Features

- JWT authentication required
- Password field is optional during updates
- Form validation on both client and server side
- Error handling for API failures
- Automatic logout on authentication errors

## Responsive Design

- Mobile-first approach
- Collapsible navigation menu
- Touch-friendly interface
- Optimized for various screen sizes 