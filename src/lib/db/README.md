# She Niketan Database Layer

This directory contains all Mongoose schemas and models for the She Niketan Girls Residence Management System.

## Overview

The database layer is built with Mongoose and MongoDB, providing type-safe models with validation. All models include proper indexing for performance optimization.

## Structure

```
src/lib/db/
├── mongoose.ts              # Connection management with dev hot-reload support
├── models/
│   ├── User.ts             # User model (member, warden, admin)
│   ├── Room.ts             # Room management model
│   ├── Complaint.ts        # Complaint tracking model
│   ├── LeaveRequest.ts     # Leave request model
│   ├── Notice.ts           # Notice/announcement model
│   ├── ResidenceSettings.ts # Settings/configuration model
│   └── index.ts            # Central exports
└── index.ts                # Main entry point
```

## Models & Schemas

### User Model
Stores user information with role-based access control.

```typescript
interface IUser {
  _id: ObjectId;
  name: string;
  email: string (unique);
  passwordHash: string;
  role: 'member' | 'warden' | 'admin';
  phone?: string;
  roomNumber?: string;
  createdAt: Date;
  isActive: boolean;
}
```

**Indexes**: email

---

### Room Model
Manages residence rooms and occupancy tracking.

```typescript
interface IRoom {
  _id: ObjectId;
  roomNumber: string (unique);
  type: 'Single' | 'Shared';
  capacity: number;
  occupied: number;
  status: 'Vacant' | 'Partially Occupied' | 'Occupied' | 'Maintenance';
  residents: ObjectId[] (refs User);
  createdAt: Date;
  updatedAt: Date;
}
```

**Indexes**: roomNumber

**Constraints**:
- Capacity must be > 0
- Occupied count cannot exceed capacity or be negative
- Single rooms have capacity = 1
- Shared rooms have capacity >= 2

---

### Complaint Model
Tracks complaints and maintenance requests from residents.

```typescript
interface IComplaint {
  _id: ObjectId;
  residentId: ObjectId (ref User);
  title: string;
  category: 'Water' | 'Electricity' | 'WiFi' | 'Maintenance' | 'Other';
  description: string;
  status: 'Pending' | 'In Progress' | 'Done' (default: 'Pending');
  adminReply?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

**Indexes**: residentId, status, createdAt (desc)

**Constraints**:
- Title: max 200 characters
- Description: min 10 characters
- Default status: 'Pending'

---

### LeaveRequest Model
Manages leave requests from residents.

```typescript
interface ILeaveRequest {
  _id: ObjectId;
  residentId: ObjectId (ref User);
  leaveType: 'Temporary' | 'Weekend' | 'Permanent';
  fromDate: Date;
  toDate: Date;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected' (default: 'Pending');
  createdAt: Date;
  updatedAt: Date;
}
```

**Indexes**: residentId, status, fromDate+toDate

**Constraints**:
- toDate must be after fromDate
- Reason: min 10 characters
- Default status: 'Pending'

---

### Notice Model
Manages notices and announcements for the residence.

```typescript
interface INotice {
  _id: ObjectId;
  category: 'Maintenance' | 'Emergency' | 'Event';
  title: string;
  content: string;
  postedBy: ObjectId (ref User);
  createdAt: Date;
  updatedAt: Date;
}
```

**Indexes**: category, postedBy, createdAt (desc)

**Constraints**:
- Title: max 200 characters
- postedBy should be a User with 'warden' or 'admin' role

---

### ResidenceSettings Model
Stores residence configuration and settings.

```typescript
interface IResidenceSettings {
  _id: ObjectId;
  residenceName: string (unique);
  contactNumber: string;
  address: string;
  logoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

**Constraints**:
- Valid contact number format
- residenceName is unique

---

## Usage

### Connection

```typescript
import { connectMongoose } from '@/lib/db';

// Call this once in your API route or server component
await connectMongoose();
```

### Models

```typescript
import {
  User,
  Room,
  Complaint,
  LeaveRequest,
  Notice,
  ResidenceSettings,
  type IUser,
  type IRoom,
  // ... other types
} from '@/lib/db/models';

// Create
const user = await User.create({
  name: 'John Doe',
  email: 'john@example.com',
  passwordHash: 'hashed_password',
  role: 'member',
});

// Read
const room = await Room.findById(roomId).populate('residents');

// Update
await Complaint.findByIdAndUpdate(complaintId, {
  status: 'Done',
  adminReply: 'Issue resolved',
});

// Delete
await LeaveRequest.findByIdAndDelete(leaveId);

// Query with filters
const pendingComplaints = await Complaint.find({ status: 'Pending' })
  .populate('residentId', 'name email')
  .sort({ createdAt: -1 });
```

## Relationships

```
User ◄───────────► Room (one-to-many)
       residents

User ◄───────────► Complaint (one-to-many)
     residentId

User ◄───────────► LeaveRequest (one-to-many)
     residentId

User ◄───────────► Notice (one-to-many)
     postedBy
```

## Validation & Error Handling

All schemas include built-in validation:

```typescript
try {
  await Room.create({
    roomNumber: 'A101',
    type: 'Single',
    capacity: -1, // Invalid
  });
} catch (error) {
  if (error.name === 'ValidationError') {
    console.log(error.message);
  }
}
```

## Best Practices

1. **Always connect before queries**:
   ```typescript
   await connectMongoose();
   ```

2. **Populate references for related data**:
   ```typescript
   await Complaint.findById(id).populate('residentId');
   ```

3. **Use indexes for frequently queried fields** (already configured)

4. **Handle validation errors**:
   ```typescript
   if (error.name === 'ValidationError') {
     // Handle validation
   }
   if (error.code === 11000) {
     // Handle duplicate key error
   }
   ```

5. **Type your queries**:
   ```typescript
   const user: IUser | null = await User.findById(id);
   ```

## Development

- Models auto-reload on changes in development
- Connection is cached globally to avoid reconnects
- No need to manually create indexes (Mongoose does this)

## Future Extensions

Potential areas for expansion:
- Compound indexes for complex queries
- Middleware for audit logging
- Virtual fields for computed properties
- Hooks for cascading deletes
- Soft deletes for data retention
