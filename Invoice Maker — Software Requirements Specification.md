# Invoice Maker — Software Requirements Specification (SRS)

**Version:** 1.0  
**Project Type:** Invoice Management Web Application  
**Primary Role:** Admin  
**Frontend + Backend:** Next.js  
**Database:** MongoDB  
**PDF Generation:** Browser-side only  
**Image Storage:** Cloudinary  
**Styling:** Tailwind CSS  

---

# 1. Project Overview

## 1.1 Purpose

The purpose of this application is to provide a simple, modern, secure, and easy-to-use invoice management system for a store/business.

The system will allow an authenticated Admin to:

- Manage store information
- Manage products
- Define a standard/default price for each product
- Manage product stock
- Create invoices
- Select products while creating invoices
- Change the product price specifically for an invoice
- Calculate invoice totals automatically
- Automatically decrease product stock after invoice creation
- View previous invoices
- Search invoices
- Generate unique invoice IDs
- Print invoices in A4 format
- Download invoices as A4 PDF directly from the browser

Public users/customers will not be able to create, edit, or delete invoices.

Public users will only be able to search for an invoice using its unique Invoice ID and view, print, or download that invoice.

---

# 2. Technology Stack

## 2.1 Required Technologies

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend

- Next.js App Router
- Next.js Route Handlers / API routes
- TypeScript

### Database

- MongoDB
- Mongoose

### Authentication

- Auth.js / secure session-based authentication

### Image Storage

- Cloudinary

### Validation

- Zod

### PDF

Browser-side PDF generation only.

The application must NOT use:

- Puppeteer
- Playwright PDF generation
- Server-side PDF generation
- Any server-side PDF rendering service

PDF generation must happen inside the user's browser.

Recommended approach:

```text
Invoice HTML
     ↓
Browser
     ↓
Print / Browser PDF
     ↓
A4 PDF
```

The invoice page must be optimized for:

- A4 paper
- Print
- Browser "Save as PDF"

---

# 3. User Roles

The application has only one authenticated role:

```text
ADMIN
```

No customer account system is required.

No:

- Staff role
- Manager role
- Super Admin role
- Customer role
- Role management UI

is required for Version 1.

---

# 4. Authentication and Authorization

## 4.1 Admin Authentication

Admin authentication is mandatory.

The Admin must log in before accessing the admin panel.

Login page:

```text
/admin/login
```

Login fields:

- Email
- Password

---

## 4.2 Protected Admin Routes

All routes under:

```text
/admin/*
```

must require authentication except:

```text
/admin/login
```

Unauthenticated users attempting to access an admin route must be redirected to:

```text
/admin/login
```

---

## 4.3 Public Routes

The following routes must be publicly accessible:

```text
/
```

and:

```text
/invoice/[invoiceNumber]
```

Public users can:

- Search invoices
- View invoices
- Print invoices
- Download invoices as PDF

Public users cannot:

- Create invoices
- Edit invoices
- Delete invoices
- Edit products
- Delete products
- Change stock
- Change store information
- Access dashboard

---

# 5. Application Structure

The application should have two major sections.

## 5.1 Public Section

```text
/
```

Homepage.

```text
/invoice/[invoiceNumber]
```

Public invoice page.

---

## 5.2 Admin Section

```text
/admin/login
/admin/dashboard
/admin/invoices
/admin/invoices/create
/admin/invoices/[id]
/admin/invoices/[id]/edit
/admin/products
/admin/store
/admin/settings
```

---

# 6. Homepage

The homepage is public.

Route:

```text
/
```

## 6.1 Homepage Requirements

The homepage should contain:

- Store/business branding
- Store logo
- Store name
- Short welcome/instruction text
- Invoice search form

Example:

```text
--------------------------------------------

              STORE LOGO

             STORE NAME

       Search your invoice

   [ Enter Invoice ID             ]

            [ Search ]

--------------------------------------------
```

---

# 7. Invoice Search

The homepage must provide an invoice search feature.

The customer enters:

```text
INV-8F4K2P91
```

The system searches the database for the matching invoice.

If found:

```text
/invoice/INV-8F4K2P91
```

The user is redirected to the public invoice page.

If not found:

```text
Invoice not found.

Please check your Invoice ID and try again.
```

---

# 8. Invoice ID

Every invoice must have a unique human-readable Invoice ID.

Do not expose MongoDB `_id` as the public Invoice ID.

## 8.1 Invoice ID Format

Recommended format:

```text
INV-XXXXXXXX
```

Example:

```text
INV-8F4K2P91
```

or:

```text
INV-20260908-8F4K2P
```

The Invoice ID must be:

- Unique
- Non-sequential or difficult to guess
- Case-insensitive during search
- Suitable for printing
- Suitable for manually typing

Avoid simple sequential IDs such as:

```text
INV-000001
INV-000002
INV-000003
```

because they are easy to guess.

---

# 9. Admin Dashboard

Route:

```text
/admin/dashboard
```

The dashboard should provide a quick overview.

## 9.1 Dashboard Statistics

Display:

- Total invoices
- Total products
- Today's invoices
- Today's sales

Example:

```text
┌─────────────────────┐
│ Total Invoices      │
│ 1,284               │
└─────────────────────┘

┌─────────────────────┐
│ Total Products      │
│ 86                  │
└─────────────────────┘

┌─────────────────────┐
│ Today's Invoices    │
│ 24                  │
└─────────────────────┘

┌─────────────────────┐
│ Today's Sales       │
│ ৳45,800             │
└─────────────────────┘
```

---

# 10. Admin Sidebar

The admin dashboard should have a sidebar.

Recommended menu:

```text
Dashboard

Invoices
  ├── All Invoices
  └── Create Invoice

Products

Store Information

Settings
```

---

# 11. Store Information

Route:

```text
/admin/store
```

The Admin can manage store information.

## 11.1 Store Fields

Required fields:

```text
Store Name
Proprietor Name
Address
Phone
Store Image
```

---

# 12. Store Image

Store image/logo should be uploaded to Cloudinary.

The application must NOT store image binary data directly inside MongoDB.

MongoDB should only store the Cloudinary URL.

Example:

```text
storeImageUrl:
https://res.cloudinary.com/...
```

## 12.1 Image Flow

```text
Admin
  ↓
Select Store Image
  ↓
Upload
  ↓
Cloudinary
  ↓
Cloudinary URL
  ↓
MongoDB
```

The UI should display an image preview before/after upload.

---

# 13. Store Data Model

```typescript
interface Store {
  _id: string;

  storeName: string;
  proprietorName: string;

  address: string;
  phone: string;

  storeImageUrl?: string;

  createdAt: Date;
  updatedAt: Date;
}
```

There should normally be only one active Store record for Version 1.

The Admin edits the existing store information instead of creating multiple stores.

---

# 14. Product Management

Route:

```text
/admin/products
```

The Admin can:

- Add products
- View products
- Edit products
- Delete products
- Search products

---

# 15. Product Fields

Each product must contain:

```text
Product Name
Standard Price
Stock
```

## 15.1 Important Pricing Rule

Every product has a **Standard Price**.

Example:

```text
Product:
Rice 5kg

Standard Price:
৳450

Stock:
25
```

The Standard Price is the normal/default price of the product.

However, when creating an invoice, the Admin must be able to change the price for that specific invoice.

---

# 16. Product Price Override

This is a critical business requirement.

Example:

Product database:

```text
Rice 5kg
Standard Price: ৳450
Stock: 25
```

When creating an invoice:

```text
Product: Rice 5kg
Quantity: 2
Unit Price: ৳430
```

The Admin can change:

```text
৳450 → ৳430
```

for that invoice.

The product's standard price must remain:

```text
৳450
```

The invoice stores:

```text
unitPrice: 430
```

The product database remains:

```text
price: 450
```

---

# 17. Product Data Model

```typescript
interface Product {
  _id: string;

  name: string;

  standardPrice: number;

  stock: number;

  createdAt: Date;
  updatedAt: Date;
}
```

---

# 18. Product CRUD

The following operations are required.

## Create

```text
POST /api/products
```

## Read

```text
GET /api/products
GET /api/products/[id]
```

## Update

```text
PATCH /api/products/[id]
```

## Delete

```text
DELETE /api/products/[id]
```

All product management APIs must require Admin authentication.

---

# 19. Product List UI

Example:

```text
Products

[ Search products... ]     [ + Add Product ]

---------------------------------------------------------
Product             Standard Price       Stock     Action
---------------------------------------------------------
Rice 5kg            ৳450                 25        Edit
Oil 2L              ৳380                 12        Edit
Sugar 1kg           ৳140                 40        Edit
---------------------------------------------------------
```

Actions:

- Edit
- Delete

---

# 20. Create Invoice

Route:

```text
/admin/invoices/create
```

Only Admin users can create invoices.

---

# 21. Invoice Creation Form

The invoice creation page should contain the following sections:

```text
1. Customer Information
2. Product / Items
3. Pricing
4. Summary
5. Invoice Actions
```

---

# 22. Customer Information

Fields:

```text
Customer Name *
Address
Phone Number
```

Example:

```text
Customer Name:
Rahim Ahmed

Address:
Joypurhat, Bangladesh

Phone:
01XXXXXXXXX
```

Customer Name is required.

Address and phone may be optional.

---

# 23. Invoice Product Selection

The Admin can add one or more products to the invoice.

The UI should provide a searchable product selector.

Example:

```text
[ Select Product... ]
```

After selecting a product:

```text
Product: Rice 5kg

Available Stock: 25

Quantity: [ 2 ]

Unit Price: [ 450 ]

Total: ৳900
```

---

# 24. Editable Invoice Price

The Unit Price field must be editable.

Example:

```text
Product        Qty      Unit Price      Total
------------------------------------------------
Rice 5kg       2        [ 430 ]        ৳860
```

The Admin can change:

```text
450 → 430
```

The calculation must immediately update:

```text
2 × 430 = 860
```

Changing the invoice Unit Price must NOT change the product's Standard Price.

---

# 25. Invoice Item Data

When an invoice is created, each invoice item must store a snapshot of the relevant product information.

Example:

```typescript
interface InvoiceItem {
  productId: string;

  name: string;

  quantity: number;

  unitPrice: number;

  total: number;
}
```

---

# 26. Why Product Snapshot Is Required

Example:

Today:

```text
Rice 5kg
Standard Price = ৳450
```

Invoice created:

```text
Rice 5kg
Unit Price = ৳430
Quantity = 2
```

The invoice stores:

```text
name: Rice 5kg
unitPrice: 430
quantity: 2
```

Later, the Admin changes the product Standard Price:

```text
Rice 5kg
Standard Price = ৳500
```

The old invoice must still display:

```text
Rice 5kg
Unit Price = ৳430
```

The invoice must never dynamically use the current product price.

---

# 27. Invoice Calculation

For every invoice item:

```text
itemTotal = quantity × unitPrice
```

Example:

```text
Quantity = 3
Unit Price = ৳450

Item Total = ৳1,350
```

---

# 28. Invoice Summary

The invoice should support:

```text
Subtotal
Discount
Grand Total
```

Calculation:

```text
Subtotal = sum of all item totals

Grand Total = Subtotal - Discount
```

Discount cannot make the Grand Total negative.

Example:

```text
Subtotal:       ৳1,700
Discount:       ৳100
--------------------
Grand Total:    ৳1,600
```

---

# 29. Discount

The Admin can optionally enter a discount.

Version 1 can use a fixed monetary discount:

```text
Discount: ৳100
```

No percentage discount is required unless needed later.

---

# 30. Invoice Stock Validation

When creating an invoice, the backend must validate stock.

Example:

```text
Product stock = 10

Requested quantity = 3
```

Allowed.

After successful invoice creation:

```text
Remaining stock = 7
```

---

# 31. Insufficient Stock

If:

```text
Available stock = 2
Requested quantity = 5
```

Invoice creation must fail.

Display:

```text
Insufficient stock.

Available stock: 2
Requested quantity: 5
```

The invoice must NOT be created.

---

# 32. Stock Deduction

Stock should be deducted only after the invoice is successfully validated and saved.

Example:

Before:

```text
Rice stock = 20
```

Invoice:

```text
Rice × 3
```

After:

```text
Rice stock = 17
```

---

# 33. Stock and Invoice Price Are Independent

Changing the invoice price does not affect stock.

Example:

```text
Standard Price: ৳450
Invoice Price:  ৳420
Quantity:       3
```

Stock deduction:

```text
-3
```

The price difference has no effect on stock.

---

# 34. Invoice Data Model

Recommended schema:

```typescript
interface Invoice {
  _id: string;

  invoiceNumber: string;

  customer: {
    name: string;
    address?: string;
    phone?: string;
  };

  items: InvoiceItem[];

  subtotal: number;

  discount: number;

  grandTotal: number;

  status: "PAID" | "DUE" | "CANCELLED";

  createdAt: Date;
  updatedAt: Date;
}
```

---

# 35. Invoice Status

Version 1 should support:

```text
PAID
DUE
CANCELLED
```

Default status:

```text
PAID
```

The Admin can select the status while creating/editing an invoice.

If payment tracking is not required initially, the status can remain `PAID` by default.

---

# 36. Invoice Creation Flow

```text
Admin Login
    ↓
Admin Dashboard
    ↓
Create Invoice
    ↓
Enter Customer Information
    ↓
Select Product
    ↓
Product Standard Price Automatically Loaded
    ↓
Admin Can Edit Unit Price
    ↓
Enter Quantity
    ↓
Calculate Item Total
    ↓
Add More Products if Required
    ↓
Calculate Subtotal
    ↓
Apply Discount
    ↓
Calculate Grand Total
    ↓
Validate Stock
    ↓
Generate Unique Invoice Number
    ↓
Create Invoice
    ↓
Deduct Stock
    ↓
Show Created Invoice
    ↓
┌───────────────────────┐
│ Print Invoice         │
│ Download PDF          │
└───────────────────────┘
```

---

# 37. Invoice Database Transaction

Invoice creation and stock deduction must be handled safely.

The system should avoid a situation where:

```text
Invoice saved
BUT
Stock not deducted
```

or:

```text
Stock deducted
BUT
Invoice not saved
```

When supported by the MongoDB deployment, use a MongoDB transaction/session for:

```text
Create Invoice
+
Update Product Stock
```

Both operations should succeed together.

If one fails, the operation should roll back.

---

# 38. Invoice List

Route:

```text
/admin/invoices
```

The Admin can see all invoices.

Example:

```text
Invoices

[ Search Invoice ID... ]
[ Search Customer... ]

---------------------------------------------------------
Invoice ID       Customer       Total       Date
---------------------------------------------------------
INV-8F4K2P91     Rahim Ahmed    ৳1,600     Sep 8
INV-Q8F3L2ZT     Karim Hasan    ৳850       Sep 8
---------------------------------------------------------
```

---

# 39. Invoice Actions

For every invoice:

```text
View
Edit
Print
Download
Delete
```

Only Admin can perform Edit/Delete.

Public users cannot.

---

# 40. Admin Invoice View

Route:

```text
/admin/invoices/[id]
```

The Admin can view the complete invoice.

Buttons:

```text
Print
Download PDF
Edit
Delete
```

---

# 41. Public Invoice Page

Route:

```text
/invoice/[invoiceNumber]
```

This page must be accessible without login.

It should display:

## Store Information

```text
Store Logo

Store Name
Proprietor Name
Address
Phone
```

## Invoice Information

```text
Invoice
Invoice ID
Invoice Date
```

## Customer Information

```text
Customer Name
Address
Phone
```

## Items

```text
Product       Qty       Unit Price       Total
------------------------------------------------
Rice 5kg       2          ৳430           ৳860
Oil 2L         1          ৳380           ৳380
------------------------------------------------
```

## Summary

```text
Subtotal:       ৳1,240
Discount:       ৳40
Grand Total:    ৳1,200
```

---

# 42. Public Invoice Actions

The public invoice page must contain:

```text
[ Download PDF ]

[ Print Invoice ]
```

No edit/delete buttons.

---

# 43. Browser-Side PDF Generation

PDF generation must happen entirely on the client/browser.

There must be no server-side PDF generation.

The application should use the rendered invoice HTML and browser printing functionality.

Recommended approach:

```text
Invoice Component
       ↓
Print-specific CSS
       ↓
window.print()
       ↓
Browser Print Dialog
       ↓
Save as PDF
```

The user can select:

```text
Destination → Save as PDF
Paper Size → A4
```

The invoice must be optimized so that the resulting PDF looks like a professional A4 invoice.

---

# 44. Print Requirements

The invoice must be designed specifically for:

```text
A4 Portrait
```

Print CSS must define:

```css
@page {
  size: A4;
  margin: 0;
}
```

The print version must hide:

- Navigation
- Sidebar
- Search UI
- Buttons
- Admin controls
- Other unnecessary UI

Only the invoice itself should appear on paper/PDF.

---

# 45. Print Layout

The invoice should fit within an A4 page whenever possible.

Recommended structure:

```text
┌──────────────────────────────────────┐
│             STORE LOGO               │
│                                      │
│            STORE NAME                │
│          Proprietor Name             │
│             Address                  │
│              Phone                   │
├──────────────────────────────────────┤
│                                      │
│                INVOICE               │
│                                      │
│ Invoice ID: INV-8F4K2P91              │
│ Date: 08 September 2026               │
│                                      │
│ Customer: Rahim Ahmed                 │
│ Address: Joypurhat                    │
│ Phone: 01XXXXXXXXX                    │
│                                      │
├──────────────────────────────────────┤
│ Product | Qty | Unit Price | Total   │
├──────────────────────────────────────┤
│ Rice    |  2  | ৳430       | ৳860   │
│ Oil     |  1  | ৳380       | ৳380   │
├──────────────────────────────────────┤
│                          Subtotal     │
│                          Discount     │
│                          GRAND TOTAL   │
│                                      │
│             Thank You!               │
└──────────────────────────────────────┘
```

---

# 46. Invoice PDF Quality Requirements

The browser-generated PDF should preserve:

- Store logo
- Store information
- Invoice ID
- Date
- Customer information
- Product table
- Unit prices
- Quantities
- Item totals
- Subtotal
- Discount
- Grand total
- Invoice status
- Footer

The PDF must not include:

- Buttons
- Navigation
- Admin sidebar
- Search form
- Browser UI

---

# 47. Invoice Editing

Admin can edit an existing invoice.

Example:

```text
Old Invoice:

Rice × 2
Unit Price = ৳430
```

Admin changes:

```text
Rice × 3
Unit Price = ৳420
```

The system must correctly adjust stock.

---

# 48. Stock Adjustment During Invoice Edit

Example:

Original invoice:

```text
Rice × 3
```

Stock after invoice:

```text
17
```

Admin changes invoice:

```text
Rice × 5
```

Difference:

```text
+2
```

New stock:

```text
17 - 2 = 15
```

---

## 48.1 Quantity Reduced

Original:

```text
Rice × 5
```

Updated:

```text
Rice × 3
```

Difference:

```text
-2
```

The system should return 2 units to stock.

Example:

```text
Current stock = 15

15 + 2 = 17
```

---

## 48.2 Product Removed

If an invoice originally contains:

```text
Rice × 3
```

and Admin removes Rice from the invoice:

```text
Rice × 3 → removed
```

The 3 units must be returned to product stock.

---

# 49. Invoice Deletion

Only Admin can delete an invoice.

When an invoice is deleted, its quantities should be returned to product stock.

Example:

```text
Invoice:
Rice × 3
Oil × 2
```

Deleting the invoice:

```text
Rice stock +3
Oil stock +2
```

The system must perform stock restoration safely.

---

# 50. Recommended Alternative for Deletion

For a real production system, a soft-delete approach is preferable.

Instead of permanently deleting:

```text
isDeleted: true
```

can be used.

However, Version 1 may use normal deletion if required.

If soft delete is implemented, deleted invoices must not appear in normal invoice lists or public search.

---

# 51. Invoice Search in Admin Panel

Admin should be able to search by:

```text
Invoice ID
Customer Name
Customer Phone
```

Search should be case-insensitive where applicable.

---

# 52. Product Search

Admin should be able to search products by:

```text
Product Name
```

The product selection dropdown during invoice creation should also support searching.

---

# 53. Form Validation

Use Zod for backend validation.

## Customer

```text
name: required
address: optional
phone: optional
```

## Product

```text
name: required
standardPrice: number >= 0
stock: integer >= 0
```

## Invoice Item

```text
productId: required
name: required
quantity: integer > 0
unitPrice: number >= 0
total: calculated
```

The backend must never trust totals sent by the client.

---

# 54. Server-Side Calculation

Even though the invoice UI calculates totals live in the browser, the backend must recalculate:

```text
itemTotal
subtotal
discount
grandTotal
```

before saving the invoice.

Client-side calculations are only for UI convenience.

The server is the source of truth.

---

# 55. Security Requirements

## Authentication

Admin authentication must be secure.

Passwords must never be stored as plain text.

Use a strong password hashing algorithm.

---

## Authorization

Every Admin-only API must verify the authenticated Admin session.

Example:

```text
POST /api/invoices
```

must reject unauthenticated requests.

---

## Public API

Public invoice lookup should expose only invoice information required for displaying the invoice.

Do not expose:

- Admin data
- Internal MongoDB IDs unnecessarily
- Authentication information
- Internal database fields
- Sensitive server information

---

# 56. Public Invoice ID Security

The public Invoice ID should not be easily enumerable.

Avoid:

```text
INV-000001
INV-000002
INV-000003
```

Prefer:

```text
INV-7K2M9X4P
INV-Q8F3L2ZT
INV-M4P7X2KA
```

This reduces the risk of users guessing other invoices.

---

# 57. API Requirements

## Authentication

```text
POST /api/auth/login
POST /api/auth/logout
```

Authentication implementation can be handled by Auth.js.

---

## Store

```text
GET    /api/store
PATCH  /api/store
POST   /api/store/upload
```

All except public-read requirements must be protected.

---

## Products

```text
GET    /api/products
POST   /api/products

GET    /api/products/[id]
PATCH  /api/products/[id]
DELETE /api/products/[id]
```

All product APIs require Admin authentication.

---

## Invoices

```text
GET    /api/invoices
POST   /api/invoices

GET    /api/invoices/[invoiceNumber]
PATCH  /api/invoices/[invoiceNumber]
DELETE /api/invoices/[invoiceNumber]
```

Rules:

```text
GET public invoice by invoiceNumber
```

may be public.

Create/update/delete must require Admin authentication.

---

# 58. API Response Format

Use a consistent response format.

Success:

```json
{
  "success": true,
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Invoice not found"
}
```

Validation error:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {}
}
```

---

# 59. Database Collections

The application should use at least:

```text
admins
stores
products
invoices
```

---

# 60. Admin Schema

```typescript
interface Admin {
  _id: string;

  email: string;

  passwordHash: string;

  createdAt: Date;
  updatedAt: Date;
}
```

Only one Admin account is required for Version 1.

---

# 61. Product Schema

```typescript
interface Product {
  _id: string;

  name: string;

  standardPrice: number;

  stock: number;

  createdAt: Date;
  updatedAt: Date;
}
```

---

# 62. Invoice Schema

```typescript
interface Invoice {
  _id: string;

  invoiceNumber: string;

  customer: {
    name: string;
    address?: string;
    phone?: string;
  };

  items: {
    productId: string;
    name: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];

  subtotal: number;

  discount: number;

  grandTotal: number;

  status: "PAID" | "DUE" | "CANCELLED";

  createdAt: Date;
  updatedAt: Date;
}
```

---

# 63. Recommended Indexes

MongoDB indexes should be added for frequently searched fields.

## Invoice

```text
invoiceNumber
customer.name
customer.phone
createdAt
```

`invoiceNumber` must have a unique index.

## Product

```text
name
```

---

# 64. UI/UX Requirements

The application should have a clean, modern, professional dashboard.

Design goals:

- Minimal
- Professional
- Fast
- Responsive
- Easy to use
- Mobile-friendly public invoice
- Desktop-friendly admin panel

---

# 65. Admin UI

The Admin dashboard should primarily be optimized for desktop.

Recommended structure:

```text
┌───────────────┬─────────────────────────────────────┐
│               │                                     │
│   Sidebar     │             Main Content            │
│               │                                     │
│ Dashboard     │                                     │
│ Invoices      │                                     │
│ Products      │                                     │
│ Store         │                                     │
│ Settings      │                                     │
│               │                                     │
└───────────────┴─────────────────────────────────────┘
```

---

# 66. Responsive Design

Public pages must be fully responsive.

The invoice must look good on:

- Desktop
- Laptop
- Tablet
- Mobile

However, print output must always use:

```text
A4 Portrait
```

---

# 67. Invoice Form UX

The invoice creation form should provide:

- Searchable product dropdown
- Automatic standard price loading
- Editable unit price
- Quantity input
- Live item total
- Add/remove item
- Live subtotal
- Discount input
- Live grand total
- Stock availability display
- Validation messages

Example:

```text
Product
[ Rice 5kg                 ]

Available Stock: 25

Quantity
[ 2 ]

Unit Price
[ 430 ]

Item Total
৳860

[ + Add Product ]
```

---

# 68. Invoice Table UX

Example:

```text
┌─────────────┬─────┬───────────┬─────────┐
│ Product     │ Qty │ Unit Price│ Total   │
├─────────────┼─────┼───────────┼─────────┤
│ Rice 5kg    │  2  │ [ 430 ]   │ ৳860   │
│ Oil 2L      │  1  │ [ 380 ]   │ ৳380   │
└─────────────┴─────┴───────────┴─────────┘
```

The price field should be visually obvious as editable.

---

# 69. Loading States

The application must provide loading states for:

- Login
- Product loading
- Product creation
- Product update
- Product deletion
- Invoice creation
- Invoice loading
- Invoice search
- Store update
- Image upload

Avoid leaving the user wondering whether an action was successful.

---

# 70. Confirmation Dialogs

Destructive operations should require confirmation.

For example:

```text
Delete Product?

This action cannot be undone.

[Cancel] [Delete]
```

For invoice deletion:

```text
Delete Invoice?

The invoice will be removed and its product quantities
will be returned to stock.

[Cancel] [Delete Invoice]
```

---

# 71. Toast Notifications

Use toast notifications for successful actions.

Examples:

```text
Product created successfully.

Product updated successfully.

Invoice created successfully.

Invoice deleted successfully.

Store information updated successfully.
```

---

# 72. Error Handling

Display user-friendly errors.

Examples:

```text
Invoice not found.

Product not found.

Insufficient stock.

Invalid invoice data.

Something went wrong.

You are not authorized to perform this action.
```

Do not expose raw database errors to users.

---

# 73. Date and Time

Invoices must store:

```text
createdAt
updatedAt
```

Invoice display date should be human-readable.

Example:

```text
08 September 2026
```

The system should use a consistent timezone configuration.

For a Bangladesh-based business, the default business timezone should be:

```text
Asia/Dhaka
```

---

# 74. Currency

Default currency:

```text
BDT / ৳
```

Example:

```text
৳1,500
```

All monetary calculations should use numeric values carefully.

Avoid floating-point calculation problems where possible.

For standard currency calculations, values should preferably be represented internally in the smallest currency unit where practical, or handled using a safe decimal strategy.

---

# 75. Invoice Number Generation

Invoice number generation must happen on the server.

The client should never decide the final Invoice ID.

Flow:

```text
Client submits invoice
        ↓
Backend validates
        ↓
Backend generates unique Invoice ID
        ↓
Database saves invoice
```

---

# 76. Duplicate Invoice Protection

The database must enforce a unique constraint on:

```text
invoiceNumber
```

If a collision occurs during generation, generate a new ID and retry.

---

# 77. Empty States

Products:

```text
No products found.

[ Add Product ]
```

Invoices:

```text
No invoices found.

[ Create Invoice ]
```

Search:

```text
No invoice found for this Invoice ID.
```

---

# 78. Admin Settings

Version 1 can contain:

```text
Change Password
Logout
```

No role management is required.

---

# 79. Logout

Admin must be able to log out from the dashboard.

After logout:

```text
/admin/*
```

must no longer be accessible.

---

# 80. Route Protection

Admin routes should be protected at the framework level.

Do not rely only on hiding buttons from the UI.

Example:

```text
User hides admin UI
≠
User is unauthorized
```

The API and server-side route protection must independently verify authentication.

---

# 81. Project Folder Structure

Recommended Next.js App Router structure:

```text
src/
│
├── app/
│   │
│   ├── (public)/
│   │   ├── page.tsx
│   │   │
│   │   └── invoice/
│   │       └── [invoiceNumber]/
│   │           └── page.tsx
│   │
│   ├── admin/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   │
│   │   ├── invoices/
│   │   │   ├── page.tsx
│   │   │   ├── create/
│   │   │   │   └── page.tsx
│   │   │   └── [id]/
│   │   │       ├── page.tsx
│   │   │       └── edit/
│   │   │           └── page.tsx
│   │   │
│   │   ├── products/
│   │   │   └── page.tsx
│   │   │
│   │   ├── store/
│   │   │   └── page.tsx
│   │   │
│   │   └── settings/
│   │       └── page.tsx
│   │
│   └── api/
│       ├── auth/
│       ├── products/
│       ├── invoices/
│       └── store/
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── admin/
│   ├── invoice/
│   ├── products/
│   └── forms/
│
├── lib/
│   ├── mongodb.ts
│   ├── auth.ts
│   ├── cloudinary.ts
│   ├── invoice.ts
│   ├── stock.ts
│   └── utils.ts
│
├── models/
│   ├── Admin.ts
│   ├── Store.ts
│   ├── Product.ts
│   └── Invoice.ts
│
├── validations/
│   ├── product.ts
│   ├── invoice.ts
│   └── store.ts
│
├── types/
│   ├── product.ts
│   ├── invoice.ts
│   └── store.ts
│
└── middleware.ts
```

---

# 82. Environment Variables

The application should use environment variables for secrets.

Example:

```env
MONGODB_URI=

AUTH_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Never hard-code secrets inside source code.

Never expose private Cloudinary credentials to the browser.

---

# 83. Cloudinary Security

Cloudinary uploads should use a secure upload strategy.

The frontend must never expose:

```text
CLOUDINARY_API_SECRET
```

Only public configuration values may be exposed to the browser.

---

# 84. Performance Requirements

The application should:

- Avoid unnecessary database queries
- Use pagination for large invoice lists
- Use indexed searches
- Debounce product search where appropriate
- Avoid loading all invoices at once
- Use optimized images
- Use Next.js image optimization where applicable

---

# 85. Invoice Pagination

The Admin invoice list should support pagination.

Example:

```text
Showing 1–20 of 1,284 invoices

[ Previous ] 1 2 3 4 5 [ Next ]
```

---

# 86. Product Pagination

If the number of products becomes large, product listing should also support pagination.

---

# 87. Invoice Public Access

Public invoice access should require only:

```text
Invoice ID
```

No login is required.

Example:

```text
/invoice/INV-8F4K2P91
```

---

# 88. Public Invoice Caching

Public invoice pages may be cached where appropriate, but the system must ensure that recently created invoices become accessible without an inappropriate stale-cache delay.

Dynamic invoice lookup is acceptable for Version 1.

---

# 89. SEO

Public homepage should have basic SEO metadata:

```text
Title
Description
Open Graph metadata
```

Invoice pages do not need extensive SEO optimization because invoices are transactional pages.

---

# 90. Accessibility

The UI should follow basic accessibility practices:

- Proper labels
- Keyboard navigation
- Focus states
- Accessible buttons
- Accessible form errors
- Good contrast
- Semantic HTML

---

# 91. Important Business Rules

## Rule 1

Only Admin can create invoices.

## Rule 2

Only Admin can edit invoices.

## Rule 3

Only Admin can delete invoices.

## Rule 4

Public users can only view invoices using Invoice ID.

## Rule 5

Every invoice must have a unique Invoice ID.

## Rule 6

Every product has a Standard Price.

## Rule 7

Invoice Unit Price is editable.

## Rule 8

Changing Invoice Unit Price does not change Product Standard Price.

## Rule 9

Invoice stores its own price snapshot.

## Rule 10

Invoice creation decreases stock.

## Rule 11

Invoice deletion restores stock.

## Rule 12

Invoice quantity changes must correctly adjust stock.

## Rule 13

The backend must validate stock.

## Rule 14

The backend must recalculate totals.

## Rule 15

PDF generation must happen in the browser.

## Rule 16

Print/PDF format must be A4.

---

# 92. Example Complete Scenario

## Product Setup

Admin creates:

```text
Product:
Rice 5kg

Standard Price:
৳450

Stock:
20
```

---

## Create Invoice

Admin creates an invoice.

Customer:

```text
Name:
Rahim Ahmed

Address:
Joypurhat

Phone:
01XXXXXXXXX
```

Admin selects:

```text
Rice 5kg
```

System automatically loads:

```text
Standard Price: ৳450
Available Stock: 20
```

Admin changes invoice price:

```text
Unit Price: ৳430
```

Quantity:

```text
3
```

System calculates:

```text
3 × ৳430 = ৳1,290
```

Discount:

```text
৳90
```

Grand Total:

```text
৳1,200
```

Admin creates invoice.

---

## Database Result

Product:

```text
name:
Rice 5kg

standardPrice:
450

stock:
17
```

Invoice:

```text
invoiceNumber:
INV-8F4K2P91

items:
[
  {
    productId: "...",
    name: "Rice 5kg",
    quantity: 3,
    unitPrice: 430,
    total: 1290
  }
]

subtotal:
1290

discount:
90

grandTotal:
1200
```

Notice:

```text
Product standardPrice = 450
Invoice unitPrice = 430
```

This is intentional.

---

# 93. Public Search Scenario

Customer visits:

```text
/
```

Enters:

```text
INV-8F4K2P91
```

Clicks:

```text
Search Invoice
```

System opens:

```text
/invoice/INV-8F4K2P91
```

Customer sees:

```text
Store Information

Invoice ID:
INV-8F4K2P91

Customer:
Rahim Ahmed

Rice 5kg × 3
Unit Price: ৳430
Total: ৳1,290

Discount: ৳90

Grand Total: ৳1,200
```

Customer can:

```text
Download PDF
Print
```

---

# 94. Non-Functional Requirements

## Reliability

Invoice creation and stock updates must remain consistent.

## Security

Admin data and credentials must be protected.

## Performance

Common pages should load quickly.

## Maintainability

Use modular components and services.

## Scalability

The architecture should allow future additions such as:

- Multiple admins
- Multiple stores
- Customers
- Reports
- Expenses
- Payments
- WhatsApp sharing
- Email invoices

without requiring a complete rewrite.

---

# 95. Version 1 Feature Scope

The first production version must include:

### Authentication

- Admin login
- Admin logout
- Protected admin routes

### Dashboard

- Total invoices
- Total products
- Today's invoices
- Today's sales

### Store

- Store name
- Proprietor name
- Address
- Phone
- Store logo
- Cloudinary upload

### Products

- Add product
- Edit product
- Delete product
- Product search
- Standard price
- Stock

### Invoices

- Create invoice
- Customer information
- Product selection
- Quantity
- Editable invoice unit price
- Automatic calculations
- Discount
- Grand total
- Unique Invoice ID
- Stock validation
- Stock deduction
- Invoice list
- Invoice search
- Invoice view
- Invoice edit
- Invoice delete
- Stock restoration/adjustment

### Public

- Homepage
- Invoice ID search
- Public invoice page
- Print
- Browser PDF generation
- A4 print layout

---

# 96. Features NOT Required in Version 1

Do NOT implement unnecessary complexity.

The following are out of scope:

- Multiple user roles
- Customer accounts
- Customer registration
- Online payment
- Payment gateway
- Email invoices
- WhatsApp integration
- SMS
- Expense management
- Profit analytics
- Inventory categories
- Supplier management
- Purchase management
- Barcode scanner
- Multi-store management
- Multi-currency
- Server-side PDF generation
- Puppeteer
- Playwright
- Subscription system

These can be added later.

---

# 97. Future Expansion Possibilities

The architecture should allow future modules:

```text
Customers
Expenses
Payments
Reports
Profit/Loss
Inventory
Suppliers
Purchase Orders
Multiple Stores
Multiple Admins
Invoice Templates
WhatsApp Sharing
Email Delivery
```

---

# 98. Definition of Done

The project is considered complete when:

### Authentication

- Admin can log in.
- Admin can log out.
- Unauthorized users cannot access admin routes.

### Store

- Admin can update store information.
- Admin can upload/change store logo.
- Store information appears correctly on invoices.

### Products

- Admin can create products.
- Admin can edit products.
- Admin can delete products.
- Admin can manage stock.
- Admin can set standard price.
- Products can be searched.

### Invoice

- Admin can create invoices.
- Customer information is saved.
- Products can be selected.
- Quantity can be entered.
- Standard price automatically loads.
- Invoice unit price can be edited.
- Edited invoice price does not modify product standard price.
- Totals are calculated correctly.
- Discount works correctly.
- Stock is validated.
- Stock is deducted correctly.
- Unique Invoice ID is generated.
- Invoice can be viewed.
- Invoice can be edited.
- Invoice deletion correctly restores stock.

### Public

- Homepage is accessible without login.
- Invoice can be searched by Invoice ID.
- Valid invoice opens correctly.
- Invalid invoice shows a proper error.
- Public users cannot edit/delete invoices.

### Print/PDF

- Invoice prints correctly.
- Print output is A4.
- Browser Save as PDF works.
- PDF contains only invoice content.
- Buttons/navigation do not appear in PDF.
- Store logo renders correctly.

---

# 99. Implementation Priority

Build the project in the following order:

```text
Phase 1
Project setup
Next.js
TypeScript
Tailwind
MongoDB
Mongoose

↓

Phase 2
Authentication
Admin login
Protected routes

↓

Phase 3
Admin layout
Sidebar
Dashboard

↓

Phase 4
Store management
Cloudinary

↓

Phase 5
Product CRUD
Standard price
Stock

↓

Phase 6
Invoice creation
Customer
Products
Editable unit price
Calculation

↓

Phase 7
Stock management
Stock validation
Stock deduction
Stock adjustment

↓

Phase 8
Invoice management
List
Search
View
Edit
Delete

↓

Phase 9
Public homepage
Invoice search

↓

Phase 10
Public invoice page

↓

Phase 11
A4 print layout
Browser PDF
Print CSS

↓

Phase 12
Security
Validation
Error handling
Loading states

↓

Phase 13
Responsive design
Testing
Production optimization
```

---

# 100. Final Architecture

The final system should follow this architecture:

```text
                         PUBLIC
                           │
             ┌─────────────┴─────────────┐
             │                           │
          Homepage                 Public Invoice
             │                           │
       Search Invoice ID          View Invoice
             │                           │
             └──────────────┬────────────┘
                            │
                     Print / PDF


                         ADMIN
                           │
                       Login 🔐
                           │
                       Dashboard
                           │
       ┌───────────────────┼───────────────────┐
       │                   │                   │
     Store              Products            Invoices
       │                   │                   │
   Store Info          CRUD + Stock        Create
   Store Logo          Standard Price      View
                                           Edit
                                           Delete
                                              │
                                              ↓
                                       Stock Management


DATABASE
│
├── admins
├── stores
├── products
└── invoices


EXTERNAL STORAGE
│
└── Cloudinary
      └── Store Logo


PDF
│
└── Browser
      └── A4 Print / Save as PDF
```

---

# 101. Critical Implementation Notes for Antigravity

When implementing this specification, follow these rules strictly:

1. **Do not create invoice creation functionality on the public homepage.**
2. **Invoice creation must only be available inside the authenticated Admin panel.**
3. **Public homepage only provides Invoice ID search.**
4. **Do not expose MongoDB `_id` as the public Invoice ID.**
5. **Generate a unique random Invoice ID on the server.**
6. **Every product must have a Standard Price.**
7. **When a product is selected during invoice creation, its Standard Price should automatically populate the invoice Unit Price field.**
8. **The Admin must be able to edit the invoice Unit Price before saving.**
9. **Changing the invoice Unit Price must NEVER update the product Standard Price.**
10. **The invoice must save its own product name, quantity, unit price, and total as a snapshot.**
11. **The backend must recalculate invoice totals instead of trusting frontend totals.**
12. **Stock must be validated on the backend.**
13. **Invoice creation and stock deduction should be atomic using MongoDB transactions where available.**
14. **Invoice editing must correctly calculate stock differences.**
15. **Invoice deletion must restore stock.**
16. **Public users must never have edit/delete access.**
17. **PDF generation must be browser-side only.**
18. **Do NOT install Puppeteer or Playwright for PDF generation.**
19. **Use print-specific CSS for A4 output.**
20. **The printed/PDF invoice must contain no admin UI or action buttons.**
21. **Use TypeScript throughout the application.**
22. **Use Zod for request validation.**
23. **Keep database logic, business logic, API handlers, and UI components modular.**
24. **Never expose environment secrets to the client.**
25. **Use proper loading, error, empty, and success states throughout the application.**
26. **Make the public invoice page responsive, but keep its print output strictly A4 Portrait.**
27. **Do not add out-of-scope features unless explicitly requested.**

---

# 102. Expected End Result

The final application should feel like a professional lightweight invoice management system.

The main workflow should be:

```text
Admin Login
     ↓
Dashboard
     ↓
Manage Store
     ↓
Manage Products
     ↓
Set Product Standard Price + Stock
     ↓
Create Invoice
     ↓
Select Product
     ↓
Standard Price Automatically Appears
     ↓
Admin Can Change Invoice Price
     ↓
Enter Quantity
     ↓
Calculate Total
     ↓
Apply Discount
     ↓
Validate Stock
     ↓
Create Invoice
     ↓
Generate Unique Invoice ID
     ↓
Deduct Stock
     ↓
Invoice Ready
     ↓
Print / Save as PDF
```

Customer workflow:

```text
Customer visits Homepage
        ↓
Enters Invoice ID
        ↓
Search
        ↓
Invoice Found
        ↓
View Invoice
        ↓
Print / Save as PDF
```

The system must remain simple, fast, secure, and maintainable while keeping the architecture ready for future expansion.