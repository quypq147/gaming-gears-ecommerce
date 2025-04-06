[English][README.md] [Vietname][README-VN.md]

# E-commerce Project

This is a full-stack e-commerce project with a backend powered by Strapi and a frontend built with Next.js.

## Getting Started

### Prerequisites

Make sure you have the following installed on your machine:

- Node.js
- npm, yarn, pnpm, or bun (package managers)

### Running the Development Server

First, navigate to the frontend directory and install the dependencies:

```bash
cd frontend
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

### Running the Backend

Navigate to the backend directory:

```bash
cd backend
npm install
```

Then, run the development server:

```bash
npm run develop
```

This will start the Strapi backend and the Nginx server.

### Environment Variables

Make sure to configure your environment variables. You can use the provided `.env.test` files in both the frontend and backend directories as a reference.

## Project Structure

### Frontend
- `src/`: Container Project Folder
- `app/`: Main application pages and components
- `assets/`: Static assets like images and styles
- `components/`: Reusable UI components
- `context/`: React context providers

### Backend

- `app/`: Strapi application files
- `config/`: Configuration files for Strapi
- `data/`: Seed data for the database
- `database/`: Database configuration and migrations
- `public/`: Public assets served by Strapi
- `src/`: Source code for custom Strapi plugins and extensions
- `types/`: TypeScript types

## Learn More

To learn more about the technologies used in this project, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Strapi Documentation](https://strapi.io/documentation) - learn about Strapi features and API.

You can check out the [Next.js GitHub repository](https://github.com/vercel/next.js) and the [Strapi GitHub repository](https://github.com/strapi/strapi) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the Vercel Platform from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Deploy on Heroku

To deploy the Strapi backend on Heroku, follow the [Strapi deployment documentation](https://strapi.io/documentation/developer-docs/latest/setup-deployment-guides/deployment.html#heroku).

