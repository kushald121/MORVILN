# Hero Images Management System

## Overview
Complete hero image management system for the admin panel with upload, edit, delete, and reorder functionality.

## Backend Implementation

### Database Schema
```sql
CREATE TABLE hero_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  cta_text VARCHAR(100),
  cta_link VARCHAR(255),
  image_url TEXT NOT NULL,
  cloudinary_public_id VARCHAR(255),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### API Endpoints

#### Public Routes
- `GET /api/hero` - Get all active hero images
- `GET /api/hero/:id` - Get single hero image

#### Admin Routes (Require Authentication & Admin Role)
- `POST /api/admin/hero` - Create hero image
- `GET /api/admin/hero` - Get all hero images (including inactive)
- `GET /api/admin/hero/:id` - Get single hero image
- `PUT /api/admin/hero/:id` - Update hero image
- `DELETE /api/admin/hero/:id` - Delete hero image
- `PATCH /api/admin/hero/:id/status` - Toggle active status
- `POST /api/admin/hero/reorder` - Reorder hero images

### Controller: HeroController
**File:** `server/src/controllers/hero.controller.ts`

Methods:
- `getHeroImages()` - Fetch all hero images
- `getHeroImage(id)` - Fetch single hero image
- `createHeroImage()` - Create new hero image with image upload
- `updateHeroImage()` - Update hero image with optional image replacement
- `deleteHeroImage()` - Delete hero image and remove from Cloudinary
- `toggleHeroImageStatus()` - Toggle active/inactive status
- `reorderHeroImages()` - Update sort order for multiple images

### Routes: HeroRoutes
**File:** `server/src/routes/hero.routes.ts`

Integrated into admin routes at `/api/admin/hero`

## Frontend Implementation

### Service: HeroService
**File:** `client/src/app/services/heroService.ts`

Methods:
- `getHeroImages()` - Fetch all hero images
- `getHeroImage(id)` - Fetch single hero image
- `createHeroImage(formData)` - Create hero image
- `updateHeroImage(id, formData)` - Update hero image
- `deleteHeroImage(id)` - Delete hero image
- `toggleHeroImageStatus(id)` - Toggle status
- `reorderHeroImages(images)` - Reorder images

### Components

#### HeroImageManager
**File:** `client/src/app/admin/components/HeroImageManager.tsx`

Main component for managing hero images:
- Display all hero images in grid
- Add new hero image
- Edit existing hero image
- Delete hero image
- Toggle active/inactive status
- Loading and error states

#### AddHeroModal
**File:** `client/src/app/admin/components/AddHeroModal.tsx`

Modal for adding new hero image:
- Image upload with preview
- Title input (required)
- Description textarea
- CTA text input
- CTA link input
- Sort order input
- Active status checkbox
- Form validation

#### EditHeroModal
**File:** `client/src/app/admin/components/EditHeroModal.tsx`

Modal for editing hero image:
- Same fields as AddHeroModal
- Current image display
- Optional image replacement
- Pre-filled form data

## Integration Steps

### 1. Database Setup
Run the SQL schema to create the `hero_images` table in your Supabase database.

### 2. Backend Integration
- Hero controller and routes are already created
- Ensure multer middleware is configured for image uploads
- Cloudinary utilities are used for image management

### 3. Frontend Integration
Add HeroImageManager to your admin dashboard:

```tsx
import HeroImageManager from '@/app/admin/components/HeroImageManager';

export default function AdminDashboard() {
  return (
    <div>
      {/* Other admin components */}
      <HeroImageManager />
    </div>
  );
}
```

## Features

### Image Management
- Upload images to Cloudinary
- Automatic image optimization
- Delete images from Cloudinary when removed
- Image preview before upload

### Hero Image Properties
- **Title**: Display name (required)
- **Description**: Optional description text
- **CTA Text**: Call-to-action button text
- **CTA Link**: Link for CTA button
- **Sort Order**: Display order on homepage
- **Active Status**: Show/hide on frontend

### Admin Features
- Create new hero images
- Edit existing hero images
- Delete hero images
- Toggle active/inactive status
- Reorder hero images
- View all hero images in grid layout
- Image preview in grid
- Bulk operations support

## Usage

### Adding a Hero Image
1. Click "Add Hero Image" button
2. Upload image
3. Fill in title and other details
4. Click "Add Hero Image"

### Editing a Hero Image
1. Click "Edit" button on hero card
2. Update fields as needed
3. Optionally change image
4. Click "Update Hero Image"

### Deleting a Hero Image
1. Click "Delete" button on hero card
2. Confirm deletion
3. Image is removed from database and Cloudinary

### Toggling Status
1. Click eye icon on hero card
2. Status is toggled immediately

## Frontend Display

To display hero images on the homepage:

```tsx
import { HeroService } from '@/app/services/heroService';

export default function HomePage() {
  const [heroImages, setHeroImages] = useState([]);

  useEffect(() => {
    HeroService.getHeroImages().then(setHeroImages);
  }, []);

  return (
    <div>
      {heroImages.map(hero => (
        <div key={hero.id}>
          <img src={hero.image_url} alt={hero.title} />
          <h2>{hero.title}</h2>
          {hero.description && <p>{hero.description}</p>}
          {hero.cta_text && (
            <a href={hero.cta_link}>{hero.cta_text}</a>
          )}
        </div>
      ))}
    </div>
  );
}
```

## Error Handling

All operations include:
- Input validation
- Error messages
- Loading states
- Graceful error recovery
- User-friendly error notifications

## Security

- Admin authentication required for all write operations
- Admin role verification
- File type validation
- Cloudinary integration for secure image storage
- CORS protection

## Performance

- Lazy loading of images
- Optimized image uploads via Cloudinary
- Efficient database queries
- Caching support
- Minimal re-renders

## Future Enhancements

- Drag-and-drop reordering
- Batch upload
- Image cropping tool
- A/B testing for hero images
- Analytics tracking
- Scheduled publishing
- Image optimization settings
