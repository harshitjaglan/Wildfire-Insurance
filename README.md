# Wildfire Insurance Claim App SWE Design Doc

**Author:** Sudomarith | [instagram.com/zero2sudo](https://instagram.com/zero2sudo)

## Problem Context

Wildfire survivors often face significant challenges when filing insurance claims due to the emotional toll and logistical difficulties of documenting losses. Current solutions, such as manual inventorying or basic forms, are inadequate because they:

- Require extensive manual effort to recall and document items.
- Lack guidance on retrieving existing purchase records or photos.
- Fail to address language, accessibility, or multi-user collaboration needs.

This leads to delays in claim processing and incomplete or inaccurate claims, impacting survivors' ability to recover.

## Proposed Solution

A web application that simplifies the insurance claim process for wildfire survivors by:

- Guiding users through inventory creation using checklists and memory aids.
- Enabling users to upload and organize existing documentation (e.g., receipts, photos).
- Supporting multiple languages, currency conversions, and accessibility features.
- Allowing multiple users to collaborate on a single claim.
- Prioritizing privacy by offering tools like photo blurring.

**Key differentiators:**

- User-friendly, guided workflows.
- Integration with common platforms like Amazon, email, and photo apps to retrieve purchase records.
- Robust multi-user and multi-session support.

## Goals and Non-Goals

### Goals

- Simplify inventory creation using guided checklists and memory aids.
- Provide tools to locate, upload, and organize existing documentation.
- Support multiple users collaborating on a claim.
- Ensure accessibility through language options, currency conversion, and usability features.
- Maintain privacy with features like photo blurring.

### Non-Goals

- Real-time integration with insurance company systems.
- Automated assessment or validation of claims.

## Design

### Overall Architecture

The web app will follow a modular design with the following components:

#### Frontend:

- **Framework:** **Next.js** with **React.js** and **TypeScript** for a responsive, dynamic UI and server-side rendering capabilities.
- **Key pages:** Setup, Inventory Checklist, Documentation Upload, Item Confirmation, Collaboration, Submission.

#### Backend:

- **Framework:** **Next.js API Routes** for handling backend logic and API endpoints.
- **ORM:** **Prisma** for interacting with the database.
- **Database:** **PostgreSQL** for structured data storage (e.g., user sessions, inventories).
- **File Storage:** **AWS S3** for uploaded documents and images.

#### Third-Party Integrations:

- Amazon, Walmart, and other e-commerce APIs for purchase records.
- Email and photo app APIs for retrieving user-generated documentation.

#### Privacy and Security:

- End-to-end encryption for data in transit and at rest.
- User-controlled photo blurring tool for sensitive data.

### Major Workflows

#### Setup Preferences:

- User selects language and currency.
- User provides household context via guided questions and checklists.

#### Inventory Initialization:

- Checklist-based room inventory (e.g., “Living Room: Couch, Lamp, Coffee Table”).

#### Documentation Retrieval:

- Tutorials and links to retrieve purchase records from Amazon, Walmart, email, and photos.
- Upload interface with drag-and-drop functionality.

#### Upload Interface:

- Drag-and-drop functionality for ease of use.
- Progress indicators for upload status.
- Preview of uploaded documents and images.
- Backend handles file uploads securely, storing files in AWS S3 and references in PostgreSQL via Prisma.

#### Item Confirmation:

- Deduplication logic to identify duplicate items and confirm with the user.

#### Collaboration:

- Invite others to collaborate and save progress across multiple sessions.

#### Submission:

- Finalize inventory and share it with the insurance company.

## Alternatives Considered

### Mobile-Only App:

- **Rejected** due to the broader usability and flexibility of a web app.
- _Note:_ Someone is welcome to build an Android app, though!

### Manual-Only Workflow:

- **Rejected** for being overly burdensome for users.

### Automated Inventory via Smart Home Devices:

- **Rejected** due to lack of widespread adoption of such devices and privacy concerns.

## Open Questions

- How can we ensure compatibility with all major email and photo platforms?
- What’s the optimal deduplication logic to minimize user frustration?
- Should we allow offline functionality for users with unreliable internet access?

## Parties Involved

- **Lead Engineer:** [Name]
- **Frontend Developer:** [Name]
- **Backend Developer:** [Name]
- **UX Designer:** [Name]
- **QA Engineer:** [Name]

## Timeline and Milestones

- **Week 1-2:** Requirements gathering and UX design finalization.
- **Week 3-4:** Backend API development with Next.js API Routes and Prisma schema design.
- **Week 5-6:** Frontend development (Setup, Inventory Checklist) using Next.js.
- **Week 7:** Integration with third-party APIs.
- **Week 8:** Testing and QA.
- **Week 9:** Deployment and user onboarding materials.

## Appendix

- Wildfire Insurance Claim App PRD
- Sample APIs for Amazon and Walmart.
- Accessibility guidelines reference.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
