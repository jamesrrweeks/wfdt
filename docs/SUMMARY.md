# WFDT — Project Summary

## What it is
What's For Dinner Tonight — a mobile-first AI meal planning web app for NZ home cooks. Solves the "6pm panic" use case. Not a weekly planner — a tonight solver.

## Live URL
wfdt.vercel.app (or your current URL)

## Tech stack
- Frontend: React JSX, single App.jsx file
- Fonts: Atkinson Hyperlegible (Google Fonts)
- Hosting: Vercel (free tier, auto-deploys from GitHub main)
- API: Anthropic Claude Sonnet via /api/generate Vercel serverless function
- No database, no auth — stateless prototype

## Repo structure
- src/App.jsx — entire frontend
- api/generate.js — serverless API route
- docs/SUMMARY.md — this file
- docs/DESIGN_SYSTEM.md — tokens, components, decisions

## Three screens
1. Input — servings, protein/carbs/veg selectors, calories accordion, free text
2. Results — 3 meal cards with descriptions, cuisine chips, regenerate
3. Recipe — ingredients (swap/remove), method, export to clipboard

## Current state
- Deployed and working
- Design system being built component by component from Figma
- Food taxonomy in design system screen for easy updating
- Saved meals / user accounts not yet built

## Next to build
- Remaining Figma components (meal card, recipe screen)
- Pork icon when available
- User accounts + saved meals (needs Supabase)
