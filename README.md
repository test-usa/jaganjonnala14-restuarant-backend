# Tasty Bites Backend

This is the backend API for the Tasty Bites Restaurant Ordering System, built with Express, MongoDB, and TypeScript.

## Features

- User authentication and authorization
- Product and category management
- Order processing
- Reward points system
- Analytics and reporting
- Admin dashboard
- Employee portal

## Tech Stack

- Node.js
- Express.js
- TypeScript
- MongoDB with Mongoose
- JWT Authentication

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Create a `.env` file based on `.env.example` and fill in your configuration
4. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

## API Documentation

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/change-password` - Change password

### Users

- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `PATCH /api/users/:id/role` - Update user role (admin only)
- `PATCH /api/users/:id/status` - Toggle user status (admin only)
- `POST /api/users/:id/reward-points` - Add reward points to user (admin only)
- `GET /api/users/top` - Get top customers (admin only)

### Products

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)
- `PATCH /api/products/:id/stock` - Update product stock (employee/admin)
- `GET /api/products/popular` - Get popular products
- `GET /api/products/offers` - Get special offers

### Categories

- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create category (admin only)
- `PUT /api/categories/:id` - Update category (admin only)
- `DELETE /api/categories/:id` - Delete category (admin only)
- `GET /api/categories/:id/products` - Get products by category
- `GET /api/categories/with-product-count` - Get categories with product count

### Orders

- `GET /api/orders` - Get all orders (employee/admin)
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create order (customer)
- `PATCH /api/orders/:id/status` - Update order status (employee/admin)
- `PATCH /api/orders/:id/payment` - Update payment status (employee/admin)
- `GET /api/orders/my-orders` - Get customer orders (customer)
- `GET /api/orders/statistics` - Get order statistics (admin)

### Analytics

- `GET /api/analytics/revenue` - Get revenue analytics (admin)
- `GET /api/analytics/categories` - Get product category analytics (admin)
- `GET /api/analytics/orders` - Get order trends (admin)
- `GET /api/analytics/payment-methods` - Get payment method analytics (admin)
- `GET /api/analytics/top-products` - Get top products (admin)
- `GET /api/analytics/customers` - Get customer acquisition data (admin)
- `GET /api/analytics/dashboard` - Get dashboard analytics (admin)

### Settings

- `GET /api/settings` - Get settings (admin)
- `PUT /api/settings` - Update settings (admin)
- `PUT /api/settings/rewards` - Update reward settings (admin)

### Rewards

- `GET /api/rewards/settings` - Get reward settings
- `GET /api/rewards/leaderboard` - Get customer leaderboard
- `GET /api/rewards/my-points` - Get customer reward points (customer)
- `POST /api/rewards/customers/:customerId/add` - Add reward points to customer (admin)
- `POST /api/rewards/distribute-monthly` - Distribute monthly rewards (admin)

## License

MIT
