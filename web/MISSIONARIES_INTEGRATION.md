# Missionaries Integration Setup

This document explains how to set up and use the missionaries integration between the web frontend and backend API.

## Environment Setup

Create a `.env.local` file in the `web` directory with the following content:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Backend API Endpoints

The missionaries API provides the following endpoints:

- `GET /missionaries` - Get all missionaries
- `GET /missionaries/:id` - Get a specific missionary
- `POST /missionaries` - Create a new missionary
- `PATCH /missionaries/:id` - Update a missionary
- `DELETE /missionaries/:id` - Delete a missionary (soft delete)

## Frontend Components

### API Client (`web/src/lib/api-client.ts`)
- Generic HTTP client for making API requests
- Handles error responses and JSON parsing
- Configurable base URL

### Missionaries API Service (`web/src/lib/missionaries-api.ts`)
- TypeScript interfaces for missionary data
- Service class with methods for all CRUD operations
- Type-safe API calls

### React Hooks (`web/src/lib/hooks/use-missionaries.ts`)
- `useMissionaries()` - Fetch all missionaries with loading/error states
- `useMissionary(id)` - Fetch a single missionary
- `useCreateMissionary()` - Create a new missionary
- `useUpdateMissionary()` - Update an existing missionary
- `useDeleteMissionary()` - Delete a missionary

### Pages and Components

#### Missionaries List Page (`web/src/app/missionaries/page.tsx`)
- Displays all missionaries in a table format
- Shows statistics (total, active, lives impacted, communities served)
- Provides actions to create, edit, and delete missionaries
- Includes delete confirmation modal

#### Missionary Form (`web/src/components/missionary-form.tsx`)
- Reusable form component for creating and editing missionaries
- Form validation for required fields
- Handles both create and edit modes
- Success and cancel callbacks

#### Create Missionary Page (`web/src/app/missionaries/create/page.tsx`)
- Dedicated page for creating new missionaries
- Uses the MissionaryForm component

#### Edit Missionary Page (`web/src/app/missionaries/[id]/edit/page.tsx`)
- Dynamic route for editing existing missionaries
- Pre-populates form with existing data
- Uses the MissionaryForm component

#### Updated Dashboard (`web/src/app/dashboard/page.tsx`)
- Admin dashboard with navigation cards
- Quick stats display
- Direct navigation to missionaries management

## Features Implemented

✅ **API Integration**
- Complete CRUD operations for missionaries
- Type-safe API client and service layer
- Error handling and loading states

✅ **User Interface**
- Responsive design with Tailwind CSS
- Data tables with sorting and filtering capabilities
- Form validation and error display
- Loading states and success/error feedback

✅ **Navigation**
- Dashboard with management cards
- Breadcrumb navigation
- Modal confirmations for destructive actions

✅ **Data Management**
- Real-time data fetching and updates
- Optimistic UI updates
- Proper state management with React hooks

## Usage

1. **Start the backend API** (from the `api` directory):
   ```bash
   npm run start:dev
   ```

2. **Start the frontend** (from the `web` directory):
   ```bash
   npm run dev
   ```

3. **Access the application**:
   - Main app: http://localhost:3000
   - Dashboard: http://localhost:3000/dashboard
   - Missionaries: http://localhost:3000/missionaries

## Data Flow

1. User navigates to missionaries page
2. `useMissionaries` hook fetches data from API
3. Data is displayed in table format
4. User can create/edit missionaries using forms
5. Forms use `useCreateMissionary`/`useUpdateMissionary` hooks
6. API calls are made through the missionaries service
7. UI updates reflect changes immediately

## Error Handling

- Network errors are caught and displayed to users
- Form validation prevents invalid submissions
- Loading states provide user feedback
- Delete operations require confirmation

## Future Enhancements

- Add search and filtering capabilities
- Implement pagination for large datasets
- Add image upload for missionary profiles
- Export functionality for missionary data
- Bulk operations (bulk delete, bulk update)
