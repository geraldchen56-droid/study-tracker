# Study Tracker

**Created by Gerald Chen.**

A study tracker for the IB Diploma. It keeps everything for my six subjects in one place:

- **Dashboard** with study time logged per day and per subject
- **Daily planner** for scheduling tasks into time slots
- **Task board** (kanban) for to-dos by subject
- **Flashcards** with sets per subject and a mastered/not-mastered tracker
- **Deadlines** sidebar for upcoming assessments
- **Documents** for linking notes and resources to tasks

## Credits

Designed and built by **Gerald Chen**, who owns the project and its code.

Claude (Anthropic) helped move the existing app onto Vercel: it adapted the hosting and database setup. It did not design or write the app.

## Running it

- Hosting: Vercel, deployed automatically from `main`
- Database: Neon Postgres (`DATABASE_URL` or `storage_DATABASE_URL`). Tables are created automatically on first use.
- Local build: `npm install` then `npx react-router build`
