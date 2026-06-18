# Personal Finance App
<img width="3204" height="1722" alt="personal_finance_app_preview" src="https://github.com/user-attachments/assets/9d5aea2b-00e7-49af-96ef-2f59dc1e9542" />


## 📚 About

A fullstack personal finance management application built with Next.js and PostgreSQL. It allows users to track transactions, set budgets, manage saving pots, and monitor recurring bills — all in one place, with a real-time balance overview.

## ✨ Features

### Overview
- Dashboard with current balance, total income, and total expenses at a glance
- Quick summaries of pots, budgets, transactions, and recurring bills

### Transactions
- List all transactions with pagination (10 per page)
- Search by description, contact name, or category
- Filter by category and sort by date, amount, or name
- Create, edit, and delete transactions
- Balance is automatically updated on every income or expense

### Recurring Bills
- Create recurring transactions (monthly, bimonthly, half-yearly, or annual)
- Track bill status: upcoming, due soon (within 3 days), or overdue
- Pay a bill directly from the recurring bills page
- Search and sort recurring bills

### Budgets
- Create budgets linked to spending categories
- Track how much has been spent vs. the defined budget limit
- View the 3 most recent transactions for each budget category
- Edit and delete budgets

### Saving Pots
- Create saving pots with a name, target amount, and color theme
- Add or withdraw money from a pot (balance is updated automatically)
- Track progress towards each pot's target

### Authentication & Profile
- Sign up and log in with email and password
- Update name, email, and password
- Upload a custom profile avatar
- Try the app instantly with a demo account

## 🧪 Tests

Unit tests written with [Vitest](https://vitest.dev/) covering utility functions and form validation schemas.

```bash
npm test
```

**Utilities tested:**
- `calculateTotalPages` — pagination edge cases (zero records, exact division, remainder)
- `formatToDollar` — positive, negative, zero, and large amounts
- `formatToSnakeCase` — null, undefined, multiple spaces, empty string
- `getOrdinalSuffix` — 11th/12th/13th exceptions, st/nd/rd/th suffixes
- `capitalizeFirstLetter` — undefined, empty string, mixed case
- `getBudgetsCategories` — deduplication, empty list, undefined input
- `mapCategoriesForSelect` — isUsed flag for available vs. already-used categories

**Validators tested (Zod schemas):**
- `createBudgetSchema` / `updateBudgetSchema` — required fields, positive amount
- `createPotSchema` / `updatePotSchema` — optional initialAmount, non-negative currentAmount
- `createTransactionSchema` / `updateTransactionSchema` — zero amount, invalid type, transfer restriction on update
- `updateRecurringBillSchema` / `payRecurringBillSchema` — positive amount, optional payment date

## 💻 Tech Stack

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Prisma](https://www.prisma.io/)
- [Neon PostgreSQL](https://console.neon.tech)
- [NextAuth.js](https://next-auth.js.org/)
- [Radix UI](https://www.radix-ui.com/)
- [Zod](https://zod.dev/)
- [SWR](https://swr.vercel.app/)
- [Recharts](https://recharts.org/)
- [Vitest](https://vitest.dev/)

## 🔍 Links

[Live Preview](https://maricastroc-personal-finance-app.vercel.app/) · [Repository](https://github.com/maricastroc/personal-finance-app)

## 🚀 Running locally

Clone the repository:

```bash
git clone https://github.com/maricastroc/personal-finance-app
```

Install dependencies:

```bash
npm install
```

Rename `.env.example` to `.env` and fill in the required environment variables.

Generate the Prisma client and run migrations:

```bash
npx prisma generate
npx prisma migrate dev
```

Start the development server:

```bash
npm run dev
```

Access [http://localhost:3000](http://localhost:3000) to view the application.
