# Calendar integration in SupportScout

This integration was added directly to the existing Expo Router + React Native + TypeScript + PostgreSQL architecture.

## Files added

- `server/src/routes/calendar.ts`
- `server/src/services/calendar/GoogleCalendarService.ts`
- `server/src/services/calendar/AvailabilityService.ts`
- `server/src/services/calendar/crypto.ts`
- `database/postgres/migrations/002_calendar_connections.sql`
- `services/calendar/CalendarService.ts`
- `hooks/useBandCalendar.ts`
- `components/bands/BandAvailabilityCard.tsx`

## Existing files changed

- `package.json`
- `server/src/index.ts`
- `server/.env.example`
- `app/bands/[id].tsx`
- `README.md`

No new npm dependency is required beyond packages already present in the project.

## Current UX

Open a band profile:

1. Calendar Availability appears below the contact card.
2. Choose Connect Google Calendar.
3. Complete Google consent.
4. Google redirects back into the SupportScout app.
5. Select a date range.
6. SupportScout asks Google for busy periods.
7. The availability engine removes busy periods from 08:00-18:00 Perth working hours.
8. A 30-minute buffer is applied around busy events.
9. Free slots are displayed.

## Why FreeBusy

The integration asks Google for busy intervals rather than event contents. This keeps the application from needing access to event titles, descriptions or attendees.

## Production hardening still required

- Use the application's real authenticated user instead of relying on `bandId` alone.
- Protect OAuth `state` with a server-side session or signed state.
- Store the encryption key in a proper secrets manager.
- Add a disconnect/revoke endpoint.
- Handle revoked Google refresh tokens gracefully.
- Consider Google OAuth app verification if required by Google's rules for the deployment.
- For true band-member availability, introduce a `band_members` entity and attach one calendar connection to each member.
