# Training Tracker

A web application for managing training sessions between trainers and students.

## Live Site

Access the live application at: [Training Tracker](https://training-tracker-9myzt79sd-triplepps-projects.vercel.app/)

## Features

### User Roles

- **Students** can:

  - Look up available classes
  - Book classes
  - Cancel bookings
  - View their training calendar

- **Trainers** can:
  - Create new classes
  - Edit existing classes
  - Delete classes
  - Manage their teaching schedule

## Getting Started

### Registration

1. Visit the [signup page](https://training-tracker-9myzt79sd-triplepps-projects.vercel.app/signup)
2. Fill in your details
3. To register as a Trainer, tick the "Register as Trainer" checkbox
4. Submit the form to create your account

### Local Development

To run the application locally, you'll need to use Docker for the PostgreSQL database:

1. **Start the PostgreSQL container**:

```bash
# Start the PostgreSQL container
docker-compose up -d
```

2. **Set up the database**:

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy
```

3. **Run the application**:

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Technology Stack

- React
- TypeScript
- Prisma (PostgreSQL)
- Authentication with NextAuth
- Tailwind CSS for styling
