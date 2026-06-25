# Job Management Roadmap (JOBDEE)

## Status: Pending

- [ ] **1. Registration Flow (`/register`)**
  - [ ] Create `app/register/page.tsx` (Role selection: Candidate vs Company)
  - [ ] Update `app/actions.ts` with `signUp` (Handle role-based redirect)
- [ ] **2. Candidate Profile (`/profile/edit`)**
  - [ ] Create `app/profile/edit/page.tsx` (Form: Name, Education, Resume Upload)
  - [ ] Create `app/actions.ts` -> `updateProfile`
- [ ] **3. Company Dashboard (`/company/dashboard`)**
  - [ ] Create `app/company/dashboard/page.tsx` (List current jobs)
  - [ ] Create `app/company/jobs/new/page.tsx` (Form: Post new job)
  - [ ] Create `app/actions.ts` -> `createJob`

---
## Guidelines
- Use Server Actions for all data mutations.
- Keep components minimal (shadcn-like manual components).
- Style: Minimalist, human-crafted.
