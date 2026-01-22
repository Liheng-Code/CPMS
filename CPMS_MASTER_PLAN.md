# CPMS MASTER DEVELOPMENT PLAN

**Project**: Construction Project Management System (CPMS)  
**Version**: 1.0  
**Last Updated**: January 22, 2026  
**Status**: Active Development Plan

---

## 📋 EXECUTIVE SUMMARY

This master development plan outlines the complete implementation roadmap for the CPMS (Construction Project Management System), combining all modules including the newly added Quantity Surveyor and Engineering functionality. The system is currently 40% complete with solid foundation work in Projects and Tasks management.

**Current Status**: ✅ Projects & Tasks Complete | ⚠️ Authentication Empty | ❌ Other Modules Missing

---

## 🏗️ SYSTEM ARCHITECTURE

### Technology Stack
- **Frontend**: Next.js 14 (React, TypeScript, Tailwind CSS)
- **Backend**: Node.js, Express.js, MongoDB
- **Deployment**: Vercel (Frontend) + Render (Backend)
- **Database**: MongoDB Atlas
- **Authentication**: JWT (To be implemented)

### Current Module Status

| Module | Status | Completion | Notes |
|--------|--------|------------|-------|
| Project Management | ✅ Complete | 100% | Full CRUD, search, filtering, drag-drop |
| Task Management | ✅ Complete | 100% | Full CRUD, displayOrder, filtering |
| User Authentication | ❌ Empty | 0% | All auth files exist but empty |
| Planning Module | ⚠️ Partial | 30% | Models exist, controllers incomplete |
| Quantity Surveying | ❌ Missing | 0% | NEW - Full implementation needed |
| Engineering | ❌ Missing | 0% | NEW - Full implementation needed |
| Construction | ❌ Missing | 0% | Controller empty |
| Finance | ❌ Missing | 0% | Controller empty |
| Procurement | ❌ Missing | 0% | Controller empty |
| Quality | ❌ Missing | 0% | Controller empty |
| Reports | ❌ Missing | 0% | Controller empty |

---

## 🎯 COMPREHENSIVE DEVELOPMENT ROADMAP

### **PHASE 1: FOUNDATION (Weeks 1-4)**

#### Week 1-2: Authentication & User Management
**Priority**: CRITICAL

**Backend Tasks**:
```bash
✅ Complete user.model.js schema with roles
✅ Implement auth.controller.js (register, login, logout)
✅ Create auth.middleware.js with JWT verification
✅ Implement role.middleware.js for RBAC
✅ Update existing routes to require authentication
```

**Frontend Tasks**:
```bash
✅ Create /login page
✅ Create /register page  
✅ Implement authentication context
✅ Add protected route logic
✅ Update API calls with auth headers
```

**File Locations**:
- Backend: `backend/src/models/user.model.js`, `backend/src/controllers/auth.controller.js`
- Frontend: `frontend/src/app/login/page.tsx`, `frontend/src/app/register/page.tsx`

#### Week 3-4: Planning Module Completion
**Priority**: HIGH

**Backend Tasks**:
```bash
✅ Complete discipline.controller.js
✅ Implement groupFunction.controller.js  
✅ Complete designFunctionTemplate.controller.js
✅ Implement planning.service.js
```

**Frontend Tasks**:
```bash
✅ Create /planning/disciplines page
✅ Create /planning/group-function page
✅ Create /planning/design-function-templates page
✅ Implement drag-drop functionality
```

---

### **PHASE 2: QUANTITY SURVEYING (Weeks 5-8)**

#### Week 5-6: QS Database Models
**Priority**: HIGH

**Models to Implement**:
```javascript
✅ BOQ (Bill of Quantities) Schema
✅ Material Pricing Schema  
✅ Variation Order Schema
✅ Payment Certificate Schema
✅ Subcontractor Schema
```

**File Locations**: `backend/src/models/`

#### Week 7-8: QS Core Features
**Priority**: HIGH

**Backend Implementation**:
```bash
✅ Create boq.controller.js with full CRUD
✅ Implement materialPricing.controller.js
✅ Create variationOrder.controller.js
✅ Implement paymentCertificate.controller.js
✅ Create subcontractor.controller.js
```

**Frontend Implementation**:
```bash
✅ Create /quantity-surveying page (Dashboard)
✅ Create /quantity-surveying/boq page
✅ Create /quantity-surveying/variations page
✅ Create /quantity-surveying/payments page
✅ Create /quantity-surveying/materials page
```

---

### **PHASE 3: ENGINEERING (Weeks 9-12)**

#### Week 9-10: Engineering Database Models
**Priority**: HIGH

**Models to Implement**:
```javascript
✅ Technical Specification Schema
✅ Drawing Management Schema
✅ Engineering Calculation Schema  
✅ Material Specification Schema
✅ Quality Testing Schema
```

#### Week 11-12: Engineering Core Features
**Priority**: HIGH

**Backend Implementation**:
```bash
✅ Create technicalSpecification.controller.js
✅ Implement drawing.controller.js
✅ Create engineeringCalculation.controller.js
✅ Implement materialSpecification.controller.js
✅ Create qualityTesting.controller.js
```

**Frontend Implementation**:
```bash
✅ Create /engineering page (Dashboard)
✅ Create /engineering/specifications page
✅ Create /engineering/drawings page
✅ Create /engineering/calculations page
✅ Create /engineering/testing page
```

---

### **PHASE 4: BUSINESS MODULES (Weeks 13-16)**

#### Week 13-14: Construction & Finance
**Priority**: MEDIUM

**Tasks**:
```bash
✅ Complete construction.controller.js
✅ Complete finance.controller.js
✅ Create /construction frontend pages
✅ Create /finance frontend pages
```

#### Week 15-16: Procurement & Quality
**Priority**: MEDIUM

**Tasks**:
```bash
✅ Complete procurement.controller.js  
✅ Complete quality.controller.js
✅ Create /procurement frontend pages
✅ Create /quality frontend pages
```

---

### **PHASE 5: ADVANCED FEATURES (Weeks 17-20)**

#### Week 17-18: Reporting & Dashboards
**Priority**: MEDIUM

**Tasks**:
```bash
✅ Complete report.controller.js
✅ Create main dashboard (/dashboard)
✅ Implement project detail pages
✅ Create reporting interfaces
```

#### Week 19-20: Integration & Polish
**Priority**: MEDIUM

**Tasks**:
```bash
✅ Update sidebar navigation
✅ Implement file storage system
✅ Add email notifications
✅ Performance optimization
```

---

## 🗄️ DATABASE SCHEMA ARCHITECTURE

### User & Authentication
```javascript
User {
  username, email, password, firstName, lastName,
  role: ['Admin', 'PM', 'QS', 'Engineer', 'Site Manager', 'Contractor', 'Client'],
  permissions: [{module, actions}],
  department, position, contactNumber, profilePicture
}
```

### Quantity Surveying Models
```javascript
BOQ {
  project, boqNumber, version, status,
  items: [{itemCode, description, unit, quantity, unitRate, amount}],
  totalAmount, approvedBy, currency
}

VariationOrder {
  project, voNumber, type, status, description, reason,
  items: [{description, quantity, unitRate, amount}],
  totalCost, timeImpactDays, clientApproval
}

PaymentCertificate {
  project, certificateNumber, period, contractor, status,
  workDone: [{description, quantity, unitRate, currentValue}],
  grossAmount, netAmount, taxAmount
}
```

### Engineering Models
```javascript
TechnicalSpecification {
  project, specNumber, title, version, status,
  discipline, description, standards, materials,
  workmanship, qualityRequirements, testingRequirements
}

Drawing {
  project, drawingNumber, title, discipline, drawingType,
  version, scale, fileUrl, thumbnailUrl,
  drawnBy, checkedBy, approvedBy, issueDate
}

EngineeringCalculation {
  project, calculationNumber, title, discipline, calculationType,
  description, assumptions, methodology, parameters, formulas,
  results, conclusions, references, status
}
```

---

## 🔧 API ENDPOINTS STRUCTURE

### Authentication
```
POST   /api/auth/register
POST   /api/auth/login  
POST   /api/auth/logout
GET    /api/auth/profile
PUT    /api/auth/profile
```

### Quantity Surveying
```
GET    /api/projects/:projectId/boq
POST   /api/projects/:projectId/boq
GET    /api/boq/:id
PUT    /api/boq/:id
DELETE /api/boq/:id

GET    /api/projects/:projectId/variations
POST   /api/projects/:projectId/variations
GET    /api/variations/:id
PUT    /api/variations/:id
POST   /api/variations/:id/approve

GET    /api/projects/:projectId/payments
POST   /api/projects/:projectId/payments
GET    /api/payments/:id
POST   /api/payments/:id/approve
```

### Engineering
```
GET    /api/projects/:projectId/specifications
POST   /api/projects/:projectId/specifications
GET    /api/specifications/:id
PUT    /api/specifications/:id
POST   /api/specifications/:id/approve

GET    /api/projects/:projectId/drawings
POST   /api/projects/:projectId/drawings
GET    /api/drawings/:id
PUT    /api/drawings/:id
POST   /api/drawings/:id/approve
```

---

## 🎨 FRONTEND ARCHITECTURE

### Updated Navigation Structure
```typescript
const menuItems = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Projects', path: '/projects' },
  { name: 'Planning', path: '/planning' },
  { name: 'Quantity Surveying', path: '/quantity-surveying' },
  { name: 'Engineering', path: '/engineering' },
  { name: 'Construction', path: '/construction' },
  { name: 'Procurement', path: '/procurement' },
  { name: 'Quality', path: '/quality' },
  { name: 'Finance', path: '/finance' },
  { name: 'Reports', path: '/reports' },
];
```

### Frontend Directory Structure
```
frontend/src/app/
├── auth/
│   ├── login/page.tsx
│   └── register/page.tsx
├── dashboard/page.tsx
├── projects/ (✅ Complete)
├── planning/ (✅ Partial)
├── quantity-surveying/ (❌ To Implement)
│   ├── page.tsx (Dashboard)
│   ├── boq/page.tsx
│   ├── variations/page.tsx
│   ├── payments/page.tsx
│   ├── materials/page.tsx
│   └── subcontractors/page.tsx
├── engineering/ (❌ To Implement)
│   ├── page.tsx (Dashboard)
│   ├── specifications/page.tsx
│   ├── drawings/page.tsx
│   ├── calculations/page.tsx
│   └── testing/page.tsx
└── [other modules...]
```

---

## 🔐 USER ROLES & PERMISSIONS MATRIX

| Module | Admin | PM | QS | Engineer | Site Manager | Contractor | Client |
|--------|-------|----|----|---------|--------------|------------|--------|
| **Projects** | Full | Full | Read | Read | Read | Read | Read |
| **Planning** | Full | Full | Read | Read | Read | Read | View |
| **Quantity Surveying** | | | | | | | |
| BOQ Management | Full | Full | Full | Read | Read | Read | Read |
| Variations | Full | Approve | Full | Read | Submit | Submit | Approve |
| Payments | Full | Approve | Full | Read | Verify | Submit | View |
| **Engineering** | | | | | | | |
| Specifications | Full | Full | Read | Full | Read | Read | Read |
| Drawings | Full | Full | Read | Full | Read | Read | Read |
| Calculations | Full | Full | Read | Full | Read | Read | View |
| Testing | Full | Full | Read | Full | Submit | Submit | View |

---

## 🔗 INTEGRATION POINTS

### Project-Centric Architecture
- All modules connect to projects via `projectId` reference
- Project dashboard aggregates data from all modules
- Project tasks linked to BOQ items and engineering deliverables

### Cross-Module Workflows
1. **Variation Order Workflow**: QS prepares → Engineer reviews → PM approves → Client approves
2. **Payment Workflow**: Site manager measures → QS prepares → Engineer verifies → PM approves
3. **Drawing Workflow**: Engineer drafts → Technical review → Coordination check → QS review → Approval
4. **Specification Workflow**: Engineer prepares → Peer review → QS review → PM approval → Issuance

### Data Integration
- Material specifications used in procurement and quality testing
- BOQ items linked to project tasks for cost tracking
- Engineering calculations linked to design templates
- Test results linked to material specifications

---

## 📊 PERFORMANCE & SCALABILITY

### Database Optimization
```javascript
// Indexes to implement
db.projects.createIndex({ "projectCode": 1 }, { unique: true })
db.boq.createIndex({ "project": 1, "boqNumber": 1 })
db.variations.createIndex({ "project": 1, "status": 1 })
db.drawings.createIndex({ "project": 1, "discipline": 1 })
db.users.createIndex({ "email": 1 }, { unique: true })
```

### Caching Strategy
- Redis for frequently accessed data (BOQ items, material prices)
- File CDN for drawings and documents
- Browser caching for static assets

### File Storage
- AWS S3 or similar for large files (drawings, specifications)
- Auto-generate thumbnails for drawings
- Version control for document revisions

---

## 🚀 DEPLOYMENT & BACKUP STRATEGY

### Current Deployment
- **Frontend**: Vercel (https://cpms-frontend.vercel.app)
- **Backend**: Render (https://cpms-backend.onrender.com)
- **Database**: MongoDB Atlas

### Backup Plan
- **Database**: Daily automated backups via MongoDB Atlas
- **Code**: Git version control (GitHub)
- **Documentation**: This master plan stored locally and in repository
- **Files**: Cloud storage backup for uploaded files

### Environment Variables
```env
# Backend (.env)
NODE_ENV=production
PORT=10000
MONGO_URI=mongodb+srv://cpms-db:cpms-db001@cpms.wyv23fm.mongodb.net/
JWT_SECRET=cpms-jwt-secret-2024-super-secure-key

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=https://cpms-backend.onrender.com
NEXT_PUBLIC_MONGODB_URI=mongodb+srv://cpms-db:cpms-db001@cpms.wyv23fm.mongodb.net/
NEXT_PUBLIC_BACKEND_URL=https://cpms-backend.onrender.com
```

---

## 📋 TESTING STRATEGY

### Unit Testing
- Backend: Jest for API endpoints
- Frontend: React Testing Library for components
- Database: Test with MongoDB Memory Server

### Integration Testing
- API endpoint testing
- Cross-module workflow testing
- Authentication and authorization testing

### User Acceptance Testing
- Role-based access testing
- Workflow approval testing
- Data integrity testing

---

## 🚨 RISK MITIGATION

### Technical Risks
1. **Data Integrity**: Implement proper validation and database transactions
2. **Scalability**: Design for horizontal scaling with proper indexing
3. **Security**: Comprehensive authentication and authorization
4. **File Management**: Reliable file storage with backup

### Business Risks  
1. **User Adoption**: Comprehensive training and documentation
2. **Change Management**: Gradual rollout with feedback collection
3. **Compliance**: Ensure industry standard compliance
4. **Performance**: Regular performance monitoring and optimization

---

## 📞 CONTACT & SUPPORT

### Development Team Access
- **Code Repository**: https://github.com/Liheng-Code/CPMS
- **Frontend URL**: https://cpms-frontend.vercel.app  
- **Backend URL**: https://cpms-backend.onrender.com
- **Database**: MongoDB Atlas (cpms cluster)

### Documentation Access
- **Master Plan**: `CPMS_MASTER_PLAN.md` (this file)
- **Deployment Guide**: `DEPLOYMENT.md`
- **Project Root**: `D:\12-Web Page\CPMS`

### How to Access This Plan Later
1. **Local Access**: Open `D:\12-Web Page\CPMS\CPMS_MASTER_PLAN.md`
2. **Git Access**: `git clone https://github.com/Liheng-Code/CPMS.git`
3. **Terminal Command**: `cat CPMS_MASTER_PLAN.md`
4. **Edit Command**: `code CPMS_MASTER_PLAN.md`

---

## 📈 SUCCESS METRICS

### Development Metrics
- ✅ Modules Completed: 2/11 (18%)
- ✅ API Endpoints Implemented: 8/50+ (16%)
- ✅ Frontend Pages Completed: 2/25+ (8%)
- 🎯 Target Completion: 20 weeks

### Business Metrics
- User adoption rate
- Project completion efficiency
- Cost tracking accuracy
- Document management efficiency

---

**This master plan serves as the single source of truth for CPMS development. Update this document regularly to track progress and changes.**

*Last updated: January 22, 2026*
*Next review date: Weekly*