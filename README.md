# 🎸 Support Band DB

A mobile-first application for researching, ranking and managing Perth bands for gigs and festivals.

Built with **React Native (Expo)**, **TypeScript**, **SQLite**, and **PostgreSQL**.

---

## Overview

Support Band DB is designed to replace spreadsheets and notebooks used when organising gigs.

It helps identify suitable support acts, keep track of contacts, assess compatibility, estimate audience draw, and build the strongest possible line-ups.

Originally developed around **Red Temples**, but designed so it can be used by any band, promoter or venue.

---

## Planned Features

### 🎵 Band Database

- Band profiles
- Genres
- Similar artists
- Member information
- Social media links
- Spotify integration
- Contact information
- Internal notes

### 📊 Ranking Engine

Bands are scored using weighted criteria including:

- Musical compatibility
- Audience overlap
- Estimated draw
- Current momentum
- Live performance quality
- Professionalism
- Existing relationship
- Availability

Resulting in an overall compatibility score.

---

### 🎤 Gig History

Track

- Previous gigs
- Upcoming gigs
- Festivals
- Venues
- Headliners
- Shared line-ups

---

### 🏛 Venue Database

Store

- Capacity
- Location
- Stage size
- Contacts
- Previous performances

---

### 📅 Line-up Builder

Build complete gig line-ups by selecting bands.

Automatically calculate

- Expected draw
- Audience overlap
- Compatibility score
- Estimated ticket sales

---

### 📞 Booking CRM

Manage

- Booking contacts
- Email history
- Phone numbers
- Follow-up reminders
- Previous conversations

---

### 📈 Metrics

Track

- Spotify listeners
- Instagram followers
- Facebook followers
- Estimated audience
- Growth over time

---

### 🤖 Future AI Features

Planned AI assistance includes

- Best support act recommendations
- Audience overlap estimation
- Line-up optimisation
- Festival suitability
- Similar band discovery
- Booking suggestions

---

# Technology Stack

## Frontend

- React Native
- Expo
- Expo Router
- TypeScript

## Local Storage

- SQLite

## Backend

- REST API

## Database

- PostgreSQL

## State Management

- TanStack Query
- Zustand

## Forms

- React Hook Form
- Zod

---

# Project Structure

```
app/
components/
hooks/
services/
database/
types/
utils/
assets/
docs/
backend/
```

---

# Development

Install dependencies

```bash
npm install
```

Run Expo

```bash
npx expo start
```

Android

```bash
npm run android
```

iOS

```bash
npm run ios
```

Web

```bash
npm run web
```

---

# Database

The project uses

- SQLite for local/offline storage
- PostgreSQL as the central database

The PostgreSQL schema lives in

```
database/
```

---

# Roadmap

- [ ] SQLite schema
- [ ] PostgreSQL sync
- [ ] Band CRUD
- [ ] Venue CRUD
- [ ] Contact management
- [ ] Ranking engine
- [ ] Line-up builder
- [ ] Gig history
- [ ] Spotify integration
- [ ] AI recommendations
- [ ] Offline sync
- [ ] Dark mode

---

# Long-term Goal

Become the definitive Perth support-band database, allowing bands and promoters to quickly identify the best line-up for any venue or event based on musical compatibility, audience fit and proven performance history.

---

## Author

Christopher Ellis

GitHub

https://github.com/77ellisCoder