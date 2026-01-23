# Frontend Acceptance Checklist

## Screenshots
- Capture desktop at 1440px and 1024px widths.
- Include the header, hero, pricing, and FAQ sections.

## Verification Steps
- CTA links:
  - Header Login -> `/app/login`
  - Header Sign up -> `/app/signup`
  - Hero Start trial -> `/app/signup?plan=starter`
  - Pricing Starter/Pro -> `/app/signup?plan=starter|pro`
  - Pricing Elite -> `/#demo`
- Pricing section:
  - Three tiers visible: Starter ($99/mo), Pro ($199/mo), Elite ($299/mo).
- Language:
  - Landing copy is English only.
- Dashboard table:
  - Actions column stays aligned and sticky on 1440px and 1024px.
- Engine callout:
  - When `NEXT_PUBLIC_ENGINE_API_URL` is missing, buttons requiring Engine are disabled and show the tooltip.
