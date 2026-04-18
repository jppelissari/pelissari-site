# pelissari.jppelissari.com

## Overview

This is the production site for José Pelissari — a UX and service design practitioner focused on the layer where execution, visibility, and trust break down in complex systems.

The site is not a portfolio gallery. It is a structured diagnostic instrument: every page exists to move a specific kind of visitor toward a specific kind of action, with minimum friction and maximum legibility. The information architecture, contact flow, and design system all reflect the same discipline that José applies to client work — systems that stay readable under pressure.

The architecture is intentionally minimal. No framework, no CMS, no client-side runtime dependencies. The site is built to be fast, maintainable, and structurally honest about what it is and is not trying to do.

---

## Product / UX Logic

The site operates on a single premise: a recruiter or collaborator arriving here should be able to understand what José does, why it matters, and how to engage — in under two minutes, without needing to read everything.

That logic drives every structural decision.

**Hierarchy over volume.** Each page carries one primary message and one primary action. The visual system enforces this through a strict typography scale and restrained use of accent, shadow, and surface variation. Decoration is not used where signal can do the work.

**Friction reduction at the contact layer.** The form does not ask for company name, phone number, or role. It asks for the symptom: what keeps happening, where it shows up, and what the team currently believes the problem is. This framing is intentional — it filters for the right kind of engagement and removes the overhead of a blank message box.

**Trust through consistency.** The same component logic appears across every page — same header behavior, same spacing rhythm, same feedback behavior on the form. Consistency is not a visual preference here; it is a proxy for reliability. A system that behaves predictably in small ways signals that it will behave predictably in large ones.

**Readable interaction states.** Every interactive element has a defined default, hover, focus, loading, success, and error state. Nothing disappears silently. The form provides inline feedback without a page redirect. The header responds to scroll. These details accumulate into a coherent experience of trustworthiness.

**The contact flow as service design.** The submission path — from input validation through loading state through Resend delivery — is designed to behave correctly under failure. The frontend handles network errors and server errors distinctly. The user is never left in an ambiguous state.

---

## Technical Stack

| Layer | Technology |
|---|---|
| Pages | Static HTML5 |
| Styling | Vanilla CSS (design system tokens) |
| Interactivity | Vanilla JavaScript |
| Hosting | Vercel |
| Serverless function | Vercel Functions (Node.js) |
| Email delivery | Resend |
| Fonts | Fontshare (Satoshi), Google Fonts (Poppins) |

No build step. No bundler. No client-side framework. The site deploys directly from source.

---

## Information Architecture

| Route | File | Purpose |
|---|---|---|
| `/` | `src/pages/home.html` | Primary entry point. Establishes the problem space, previews case studies, and routes toward the contact form. |
| `/work` | `src/pages/work.html` | Case study index. Two projects, each framed structurally. Case study detail pages are in development. |
| `/about` | `src/pages/about.html` | Background and methodology. Explains the operational foundation that informs the design practice. |
| `/contact` | `src/pages/contact.html` | Diagnostic intake form. The primary conversion surface. Posts to `/api/contact`. |
| `/api/contact` | `api/contact.js` | Vercel serverless function. Validates fields and delivers email via Resend. |

All routes are clean — no `.html` extensions in production. Requests to `/pages/*.html` redirect permanently (301) to their canonical clean equivalents.

---

## Design System Principles

The visual system is codified in `design-system-pelissari-v5` and implemented without drift across all pages.

**Token discipline.** All color, spacing, radius, shadow, motion, and typography values are defined as CSS custom properties in `src/styles/tokens.css`. No hardcoded values appear in component or layout CSS. Token names follow a canonical convention (`--color-background-base`, `--spacing-24`, `--shadow-ambient`) that maps directly to the design system source.

**Component consistency.** Every component — buttons, inputs, panels, feedback states, navigation — is defined once in `src/styles/components.css` and consumed without modification. Variants are expressed through modifier classes (`.btn-primary`, `.btn-ghost--inverse`, `.surface-module--intake`), not inline overrides.

**Typography hierarchy.** Eight type classes cover the full scale: `type-display`, `type-h1`, `type-h2`, `type-body-lg`, `type-body`, `type-body-sm`, `type-label`, `type-micro`. Size and weight are set at the class level only. Color modifiers (`type-body--secondary`, `type-h1--inverse`) are the only permitted inline variation. No more than three visible type sizes appear on any given screen.

**Restrained visual system.** The background is warm off-white (`#ECECEB`), not pure white. The accent (`#0F172A`) is reserved for structural and primary action use only. Shadow is applied selectively: ambient on resting surfaces, mid on elevation, raised only on hover. There is no gradient, no illustration, and no decorative element anywhere in the system.

**Implementation fidelity.** The gap between the design system specification and the deployed HTML/CSS is zero by intent. All audit issues identified during the build phase were resolved before the site reached its current production-ready state.

---

## Contact Flow

### Frontend

The form on `/contact` collects three fields:

- `recurring-issue` — required, minimum 5 characters
- `location` — optional
- `team-diagnosis` — optional

On submit, the form prevents default browser behavior, sets the submit button to a loading state, and POSTs a JSON payload to `/api/contact`. The button is disabled during the request and re-enabled on both success and error outcomes. Success reveals an inline confirmation block and resets the form. Error reveals an inline error block with a direct fallback email address. Re-submission is available after both outcomes.

### API function

`api/contact.js` is a Vercel Node.js serverless function:

1. Rejects non-POST requests with `405`.
2. Validates that `recurring-issue` is present and at least 5 characters. Returns `400` with a JSON error on failure.
3. Instantiates the Resend client using `process.env.RESEND_API_KEY`.
4. Sends a plain-text email from `contact@jppelissari.com` to `josepelissari@jppelissari.com`.
5. Returns `500` with a JSON error message if Resend reports a delivery failure.
6. Returns `200 { ok: true }` on success.

---

## Local Development

**Prerequisites**

- Node.js 18+
- Vercel CLI: `npm install -g vercel`

**Setup**

```bash
git clone https://github.com/<handle>/pelissari-site.git
cd pelissari-site
npm install
vercel dev
```

`vercel dev` serves static files at `localhost:3000` and runs `/api/contact` locally. Opening HTML files directly via `file://` will not reach the serverless function.

To test form submission locally, create `.env.local` at the project root:

```
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
```

---

## Deployment

Deployment is continuous via Vercel's GitHub integration. Every push to `main` triggers a production deploy. No build command runs — Vercel serves the `src/` directory directly.

`vercel.json` defines:
- `outputDirectory: "src"` — static root
- `rewrites` — maps clean routes to their HTML source files
- `redirects` — 301s from `/pages/*.html` to canonical clean paths

**Required environment variables**

Set in Vercel → Project → Settings → Environment Variables:

| Variable | Description |
|---|---|
| `RESEND_API_KEY` | API key from [resend.com/api-keys](https://resend.com/api-keys) |

**DNS and email sender setup**

Before the contact form delivers live email, `jppelissari.com` must be verified as a sender domain in Resend:

1. Resend dashboard → Domains → Add Domain → `jppelissari.com`
2. Add the provided SPF, DKIM, and DMARC records to the domain's DNS configuration
3. Confirm "Verified" status after propagation
4. `contact@jppelissari.com` is then a valid sending address

Until domain verification is complete, set `from` in `api/contact.js` to `onboarding@resend.dev` for functional testing.

---

## Status

| Area | State |
|---|---|
| Design system implementation | Production-ready. All tokens, components, and layout rules match the design system specification with no drift. |
| Routing | Production-ready. Clean URLs, 301 redirects, and asset paths verified. |
| Home, Work, About, Contact pages | Production-ready. |
| Mobile navigation | Production-ready. Drawer animation, keyboard handling, and scroll lock functional. |
| Scrolled header state | Production-ready. |
| Contact form (frontend) | Production-ready. Loading, success, and error states functional and re-submittable. |
| Contact API (`/api/contact`) | Production-ready pending `RESEND_API_KEY` configuration and DNS verification. |
| Case study detail pages | In development. Aethel and Arrival Control Engine linked from `/work` as in-progress. |
| 404 page | Not yet defined. Vercel default shown for unmatched routes. |
