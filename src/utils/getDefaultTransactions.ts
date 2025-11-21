import { UserProps } from "@/types/user";
import { avatarUrls, CATEGORIES } from "./constants";

const contactNames = [
  "Supermarket ABC",
  "Restaurant XYZ",
  "Coffee Shop",
  "Gas Station",
  "Online Store",
  "Gym Membership",
  "Netflix",
  "Spotify",
  "Amazon",
  "Uber",
  "Electric Company",
  "Water Company",
  "Phone Bill",
  "Internet Provider",
  "Doctor Visit",
  "Pharmacy",
  "Book Store",
  "Clothing Store",
  "Electronics Store",
  "Home Depot",
  "Target",
  "Walmart",
  "Whole Foods",
  "Starbucks",
  "McDonald's",
  "Pizza Hut",
  "Movie Theater",
  "Concert Tickets",
  "Flight Tickets",
  "Hotel Booking",
];

const getRandomContact = () => {
  const randomName =
    contactNames[Math.floor(Math.random() * contactNames.length)];
  const randomAvatar =
    avatarUrls[Math.floor(Math.random() * avatarUrls.length)];
  return { contactName: randomName, contactAvatar: randomAvatar };
};

export const getDefaultTransactions = (createdUser: UserProps) => {
  return [
    // Income Transactions
    {
      description: "Monthly Salary",
      amount: 3500,
      date: "2024-08-01T09:00:00.000Z",
      isRecurring: true,
      categoryId: CATEGORIES.GENERAL,
      contactName: "Tech Company Inc.",
      contactAvatar: "./assets/images/avatars/technova-innovations.jpg",
      type: "income",
      userId: createdUser.id,
    },
    {
      description: "Freelance Project",
      amount: 1200,
      date: "2024-08-05T14:30:00.000Z",
      isRecurring: false,
      categoryId: CATEGORIES.GENERAL,
      contactName: "Client Solutions Ltd.",
      contactAvatar: "./assets/images/avatars/bytewise.jpg",
      type: "income",
      userId: createdUser.id,
    },
    {
      description: "Investment Dividends",
      amount: 250,
      date: "2024-08-10T10:15:00.000Z",
      isRecurring: true,
      categoryId: CATEGORIES.GENERAL,
      contactName: "Investment Fund",
      contactAvatar: "./assets/images/avatars/spark-electric-solutions.jpg",
      type: "income",
      userId: createdUser.id,
    },

    // Expense Transactions - Bills
    {
      description: "Electricity Bill",
      amount: 85.5,
      date: "2024-08-03T14:00:37.000Z",
      isRecurring: true,
      categoryId: CATEGORIES.BILLS,
      contactName: "Power Utilities Co.",
      contactAvatar: "./assets/images/avatars/aqua-flow-utilities.jpg",
      type: "expense",
      userId: createdUser.id,
    },
    {
      description: "Internet Bill",
      amount: 65.0,
      date: "2024-08-02T09:25:11.000Z",
      isRecurring: true,
      categoryId: CATEGORIES.BILLS,
      contactName: "FastNet Internet",
      contactAvatar: "./assets/images/avatars/urban-services-hub.jpg",
      type: "expense",
      userId: createdUser.id,
    },

    // Expense Transactions - Groceries
    {
      description: "Weekly Groceries",
      amount: 95.5,
      date: "2024-08-12T13:40:46.000Z",
      isRecurring: false,
      categoryId: CATEGORIES.GROCERIES,
      ...getRandomContact(),
      type: "expense",
      userId: createdUser.id,
    },
    {
      description: "Supermarket Shopping",
      amount: 75.25,
      date: "2024-08-19T16:20:00.000Z",
      isRecurring: false,
      categoryId: CATEGORIES.GROCERIES,
      ...getRandomContact(),
      type: "expense",
      userId: createdUser.id,
    },

    // Expense Transactions - Dining Out
    {
      description: "Dinner with Friends",
      amount: 33.75,
      date: "2024-08-11T18:05:59.000Z",
      isRecurring: false,
      categoryId: CATEGORIES.DINING_OUT,
      ...getRandomContact(),
      type: "expense",
      userId: createdUser.id,
    },
    {
      description: "Lunch at Restaurant",
      amount: 22.5,
      date: "2024-08-15T12:30:00.000Z",
      isRecurring: false,
      categoryId: CATEGORIES.DINING_OUT,
      ...getRandomContact(),
      type: "expense",
      userId: createdUser.id,
    },

    // Expense Transactions - Transportation
    {
      description: "Gas Refill",
      amount: -45.0,
      date: "2024-08-07T08:15:00.000Z",
      isRecurring: false,
      categoryId: CATEGORIES.TRANSPORTATION,
      ...getRandomContact(),
      type: "expense",
      userId: createdUser.id,
    },
    {
      description: "Ride Sharing",
      amount: 18.75,
      date: "2024-08-14T17:45:00.000Z",
      isRecurring: false,
      categoryId: CATEGORIES.TRANSPORTATION,
      contactName: "Swift Ride Share",
      contactAvatar: "./assets/images/avatars/swift-ride-share.jpg",
      type: "expense",
      userId: createdUser.id,
    },

    // Expense Transactions - Entertainment
    {
      description: "Movie Tickets",
      amount: 32.0,
      date: "2024-08-08T20:00:00.000Z",
      isRecurring: false,
      categoryId: CATEGORIES.ENTERTAINMENT,
      ...getRandomContact(),
      type: "expense",
      userId: createdUser.id,
    },
    {
      description: "Streaming Subscription",
      amount: 15.99,
      date: "2024-08-01T00:00:00.000Z",
      isRecurring: true,
      categoryId: CATEGORIES.ENTERTAINMENT,
      contactName: "StreamFlix",
      contactAvatar: "./assets/images/avatars/pixel-playground.jpg",
      type: "expense",
      userId: createdUser.id,
    },

    // Expense Transactions - Shopping
    {
      description: "Clothing Purchase",
      amount: 89.99,
      date: "2024-08-13T14:20:00.000Z",
      isRecurring: false,
      categoryId: CATEGORIES.SHOPPING,
      ...getRandomContact(),
      type: "expense",
      userId: createdUser.id,
    },
    {
      description: "Electronics Store",
      amount: 299.99,
      date: "2024-08-06T11:30:00.000Z",
      isRecurring: false,
      categoryId: CATEGORIES.SHOPPING,
      ...getRandomContact(),
      type: "expense",
      userId: createdUser.id,
    },

    // Expense Transactions - Personal Care
    {
      description: "Haircut",
      amount: 35.0,
      date: "2024-08-09T10:00:00.000Z",
      isRecurring: false,
      categoryId: CATEGORIES.PERSONAL_CARE,
      contactName: "Style Salon",
      contactAvatar: "./assets/images/avatars/serenity-spa-and-wellness.jpg",
      type: "expense",
      userId: createdUser.id,
    },

    // Expense Transactions - Education
    {
      description: "Online Course",
      amount: 49.99,
      date: "2024-08-04T19:00:00.000Z",
      isRecurring: false,
      categoryId: CATEGORIES.EDUCATION,
      contactName: "Elevate Education",
      contactAvatar: "./assets/images/avatars/elevate-education.jpg",
      type: "expense",
      userId: createdUser.id,
    },
  ];
};
