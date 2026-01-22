# CPMS AUTHENTICATION & USER MANAGEMENT SYSTEM

## 📋 EXECUTIVE SUMMARY

The CPMS Authentication & User Management system is designed specifically for construction industry requirements, providing secure, role-based access control for construction projects, sites, and administrative functions. The system ensures only authorized personnel can access specific project data, site information, and administrative features based on their professional roles and responsibilities.

---

## 🏗️ USER HIERARCHY & ROLES

### Construction Industry User Levels

```
┌─────────────────────────────────────────────────────────────┐
│                    CONSTRUCTION COMPANY                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌───────────────┐    ┌─────────────────────────────────┐  │
│  │    ADMIN      │    │      PROJECT DIRECTOR           │  │
│  │   System Admin│    │    Company Director             │  │
│  │   IT Manager  │    │    Senior Partner               │  │
│  │               │    │                                 │  │
│  └───────────────┘    └─────────────────────────────────┘  │
│           │                           │                      │
│           ▼                           ▼                      │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                 PROJECT MANAGEMENT                       │  │
│  │                                                         │  │
│  │  ┌───────────────┐  ┌───────────────┐  ┌─────────────┐ │  │
│  │  │ PROJECT       │  │    SITE       │  │   QUANTITY  │ │  │
│  │  │ MANAGER       │  │   MANAGER     │  │ SURVEYOR    │ │  │
│  │  │ (PM)          │  │   (SM)        │  │    (QS)     │ │  │
│  │  └───────────────┘  └───────────────┘  └─────────────┘ │  │
│  └─────────────────────────────────────────────────────────┘  │
│           │                           │           │           │
│           ▼                           ▼           ▼           │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                 TECHNICAL TEAM                         │  │
│  │                                                         │  │
│  │  ┌───────────────┐  ┌───────────────┐  ┌─────────────┐ │  │
│  │  │   SENIOR      │  │    ENGINEER   │  │   FOREMAN   │ │  │
│  │  │   ENGINEER    │  │               │  │             │ │  │
│  │  └───────────────┘  └───────────────┘  └─────────────┘ │  │
│  │                                                         │  │
│  │  ┌─────────────────────────────────────────────────────┐ │  │
│  │  │                SAFETY OFFICER                       │ │  │
│  │  └─────────────────────────────────────────────────────┘ │  │
│  └─────────────────────────────────────────────────────────┘  │
│           │                                                   │
│           ▼                                                   │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                    EXTERNAL                              │  │
│  │                                                         │  │
│  │  ┌───────────────┐  ┌───────────────┐  ┌─────────────┐ │  │
│  │  │    CLIENT     │  │  SUBCONTRACTOR│  │  SUPPLIER   │ │  │
│  │  │               │  │               │  │             │ │  │
│  │  └───────────────┘  └───────────────┘  └─────────────┘ │  │
│  └─────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 ACCESS CONTROL MATRIX

### Project & Data Access by Role

| ROLE | PROJECT OVERVIEW | SITE ACCESS | BUDGET/QS | ENGINEERING | SAFETY | ADMIN |
|------|------------------|-------------|-----------|-------------|--------|-------|
| **Admin** | ✅ Full | ✅ All Sites | ✅ Full | ✅ Full | ✅ Full | ✅ Full |
| **Project Director** | ✅ Full | ✅ All Sites | ✅ Full | ✅ Full | ✅ Full | ❌ Limited |
| **Project Manager** | ✅ Full | ✅ Assigned | ✅ Full | ✅ Review | ✅ Full | ❌ Limited |
| **Site Manager** | ✅ Basic | ✅ Site Only | ✅ View | ✅ Review | ✅ Full | ❌ Limited |
| **Quantity Surveyor** | ✅ Basic | ✅ Assigned | ✅ Full | ✅ View | ✅ View | ❌ Limited |
| **Senior Engineer** | ✅ Basic | ✅ All Sites | ✅ View | ✅ Full | ✅ Review | ❌ Limited |
| **Engineer** | ✅ Basic | ✅ Assigned | ✅ View | ✅ Full | ✅ View | ❌ Limited |
| **Foreman** | ✅ Limited | ✅ Site Only | ❌ None | ✅ View | ✅ Full | ❌ Limited |
| **Safety Officer** | ✅ Basic | ✅ All Sites | ❌ None | ✅ View | ✅ Full | ❌ Limited |
| **Client** | ✅ Full | ✅ Limited | ✅ View | ✅ View | ✅ View | ❌ Limited |
| **Subcontractor** | ✅ Limited | ✅ Assigned | ✅ View | ❌ None | ✅ View | ❌ Limited |

---

## 📱 USER JOURNEY WORKFLOWS

### 1. NEW USER REGISTRATION FLOW

```
NEW USER (e.g., Engineer)
         │
         ▼
┌─────────────────┐
│  REGISTRATION   │ ──► Enter Personal Details
│     FORM        │ ──► Upload Certificates
│                 │ ──► Select Role/Trade
│                 │ ──► Add Emergency Contact
└─────────────────┘
         │
         ▼
┌─────────────────┐
│  EMAIL VERIF    │ ──► Send Verification Link
│     ICATION     │ ──► Confirm Email Address
└─────────────────┘
         │
         ▼
┌─────────────────┐
│  ADMIN REVIEW   │ ──► Employment Verification
│     QUEUE       │ ──► License Validation
│                 │ ──► Background Check
└─────────────────┘
         │
         ▼
┌─────────────────┐
│  APPROVAL/      │ ──► ✅ Approved: Account Active
│   REJECTION     │ ──► ❌ Rejected: Notification Sent
└─────────────────┘
```

### 2. DAILY LOGIN FLOW

```
USER LOGIN
    │
    ▼
┌─────────────────┐
│  LOGIN PAGE     │ ──► Username/Password
│                 │ ──► Multi-Factor Auth
│                 │ ──► Site Selection
└─────────────────┘
    │
    ▼
┌─────────────────┐
│  SESSION SETUP  │ ──► Load User Profile
│                 │ ──► Apply Role Permissions
│                 │ ──► Set Project Context
└─────────────────┘
    │
    ▼
┌─────────────────┐
│   DASHBOARD     │ ──► Role-Based View
│   DISPLAY       │ ──► Project Summary
│                 │ ──► Quick Actions
└─────────────────┘
```

### 3. SITE ACCESS CONTROL FLOW

```
SITE VISIT REQUEST
       │
       ▼
┌─────────────────┐
│  SITE LOGIN     │ ──► Verify Site Assignment
│                 │ ──► Check Time Permissions
│                 │ ──► GPS Verification (Optional)
└─────────────────┘
       │
       ▼
┌─────────────────┐
│  ACCESS GRANTED │ ──► Site-Specific Dashboard
│                 │ ──► Limited Project Data
│                 │ ──► Safety Requirements
└─────────────────┘
```

---

## 🛡️ SECURITY FEATURES

### Multi-Layer Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  LAYER 1: NETWORK SECURITY                                  │
│  ┌───────────────┐  ┌───────────────┐  ┌─────────────┐    │
│  │   IP ALLOW   │  │ RATE LIMITING │  │ SSL/TLS     │    │
│  │     LIST     │  │   (100/min)   │  │  ENCRYPTION │    │
│  └───────────────┘  └───────────────┘  └─────────────┘    │
│                                                             │
│  LAYER 2: AUTHENTICATION                                     │
│  ┌───────────────┐  ┌───────────────┐  ┌─────────────┐    │
│  │   PASSWORD    │  │ MULTI-FACTOR  │  │   SESSION   │    │
│  │  POLICIES     │  │ AUTHENTICATION│  │ MANAGEMENT  │    │
│  └───────────────┘  └───────────────┘  └─────────────┘    │
│                                                             │
│  LAYER 3: AUTHORIZATION                                      │
│  ┌───────────────┐  ┌───────────────┐  ┌─────────────┐    │
│  │  ROLE-BASED   │  │   PROJECT     │  │   SITE      │    │
│  │   ACCESS      │  │  PERMISSIONS  │  │ RESTRICTION │    │
│  └───────────────┘  └───────────────┘  └─────────────┘    │
│                                                             │
│  LAYER 4: MONITORING & AUDIT                                │
│  ┌───────────────┐  ┌───────────────┐  ┌─────────────┐    │
│  │   ACTIVITY    │  │   SECURITY    │  │   AUDIT     │    │
│  │   LOGGING     │  │   ALERTS      │  │   TRAIL     │    │
│  └───────────────┘  └───────────────┘  └─────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 USER PROFILE COMPONENTS

### Complete Construction Worker Profile

```
USER PROFILE STRUCTURE
┌─────────────────────────────────────────────────────────────┐
│  BASIC INFORMATION                                          │
│  ──────────────────────────────────────────────────────── │
│  • Name: John Smith                                         │
│  • Employee ID: EMP-2024-0142                              │
│  • Email: john.smith@construction.com                      │
│  • Phone: +1-234-567-8900                                 │
│  • Department: Engineering                                 │
│                                                             │
│  PROFESSIONAL DETAILS                                      │
│  ──────────────────────────────────────────────────────── │
│  • Position: Senior Structural Engineer                    │
│  • Trade: Structural Engineering                           │
│  • Experience: 12 years                                    │
│  • Certifications: P.E., OSHA 30, First Aid                │
│                                                             │
│  SITE ASSIGNMENTS                                           │
│  ──────────────────────────────────────────────────────── │
│  • Primary Site: Downtown Tower Project                     │
│  • Secondary Site: Bridge Construction Phase 2             │
│  • Access Level: Full Technical Access                      │
│                                                             │
│  SECURITY SETTINGS                                          │
│  ──────────────────────────────────────────────────────── │
│  • 2FA Enabled: Yes (Mobile App)                           │
│  • Last Login: 2024-01-22 08:30 AM                         │
│  • Active Sessions: 2 (Office Laptop, Tablet)              │
│  • Password Reset: Never                                    │
│                                                             │
│  EMERGENCY CONTACTS                                         │
│  ──────────────────────────────────────────────────────── │
│  • Primary: Jane Smith (Spouse) - +1-234-567-8901         │
│  • Secondary: Mike Smith (Brother) - +1-234-567-8902       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 IMPLEMENTATION PHASES

### Phase 1: CORE AUTHENTICATION (Week 1)

**Priority Tasks:**
- ✅ User database schema with construction fields
- ✅ Basic JWT authentication
- ✅ Role-based access control
- ✅ Login/Registration pages

**Deliverables:**
- Working login system
- User registration with email verification
- Basic role assignment
- Protected routes

---

### Phase 2: SECURITY ENHANCEMENT (Week 2)

**Priority Tasks:**
- ✅ Multi-factor authentication
- ✅ Password security policies
- ✅ Session management
- ✅ Account lockout protection

**Deliverables:**
- Enhanced security features
- Session timeout management
- Password reset functionality
- Security monitoring

---

### Phase 3: CONSTRUCTION FEATURES (Week 3-4)

**Priority Tasks:**
- ✅ Professional license tracking
- ✅ Site-based access control
- ✅ User approval workflow
- ✅ Admin management dashboard

**Deliverables:**
- Construction-specific user profiles
- Site assignment system
- Admin approval workflow
- User management interface

---

## 📋 KEY REQUIREMENTS COMPLIANCE

### Construction Industry Standards Met

✅ **OSHA Compliance**: Safety officer access, training records  
✅ **Professional Licensing**: P.E., trade license tracking  
✅ **Union Requirements**: Trade qualification management  
✅ **Site Security**: Location-based access control  
✅ **Project Management**: PM/SM role hierarchy  
✅ **Financial Control**: QS/Finance role segregation  
✅ **Client Access**: Limited view permissions  
✅ **Subcontractor Management**: Controlled access levels  

### Data Protection & Privacy

✅ **GDPR Compliance**: User consent, data deletion  
✅ **Company Policy**: Audit trails, activity logging  
✅ **Industry Best Practice**: Regular security updates  

---

## 🎯 SUCCESS METRICS

### Security & Usability KPIs

| Metric | Target | Current Status |
|--------|--------|----------------|
| Login Success Rate | >95% | 🔄 Pending |
| Account Lockout Rate | <2% | 🔄 Pending |
| 2FA Adoption | 100% (Staff) | 🔄 Pending |
| Registration to Approval Time | <24 hours | 🔄 Pending |
| Password Reset Success Rate | >90% | 🔄 Pending |
| User Satisfaction Score | >4.5/5 | 🔄 Pending |

---

## 📞 SUPPORT & MAINTENANCE

### Ongoing Management

- **Daily**: Security monitoring, user activity logs
- **Weekly**: Access review, permission audits
- **Monthly**: License expiry alerts, compliance checks
- **Quarterly**: Security updates, role review
- **Annually**: Full security audit, policy review

---

*Last Updated: January 22, 2026*  
*Next Review: Upon Phase 1 Completion*  
*Document Owner: System Administrator*