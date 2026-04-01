## Phase 1: Core Infrastructure & Mock Data (This session)

### 1A. Mock Data Store (`src/lib/mockData.ts`)
- Create centralized mock data: folders, albums, media, user profile, reminders, offers
- State types for backend-ready architecture

### 1B. Create/Import Bottom Sheet
- Bottom sheet modal on "Create/Import" click
- Options: Create Folder, Create Album, Import Photos/Videos, Import from Phone/iCloud/PC, Add link, Add music
- Simulate upload progress & success/error states

### 1C. Photo Folders - Enhanced
- Folder detail screen (photo grid with sorting: date/place/event)
- Right-click/long-press context menu: Rename, Delete (confirmation), Customize (color/font/theme), Password, Share
- Simulate add/move photos

### 1D. Photo Albums - Enhanced  
- Album detail screen with rich content (photos, videos, notes, voice UI, emojis, cards, links, music)
- Create album flow (title, category, cover, theme, privacy, collaboration)
- Share/download toggles

### 1E. New Screens
- **Dashboard**: Stats cards (folders, albums, media, reminders, storage, plan)
- **Reminders**: List + create, date/message, link to album/folder
- **My Profile**: Edit avatar/name/banner/language/color/font
- **Offers**: Free / Medium £3.99 / Premium £6.99 pricing cards
- **Privacy & Security**: Password reset, privacy toggles, download permission, locks
- **Help & Support**: FAQ, contact, tutorials
- **How It Works**: Video/tutorial placeholder

### 1F. States
- Empty states for all screens
- Loading states (uploading, saving, processing)
- Error states (failed upload, wrong password, network)

### Implementation Order:
1. Mock data store + types
2. Create/Import bottom sheet
3. Dashboard, Profile, Reminders, Offers, Privacy, Help screens
4. Photo Folders detail + interactions
5. Photo Albums detail + interactions  
6. States (empty/loading/error)
