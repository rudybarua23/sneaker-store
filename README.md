# Sneaker Store 🛍️

A full-stack e-commerce application for browsing and purchasing sneakers. Built with modern web technologies and deployed using AWS services for a scalable, cloud-native architecture.

## 🚀 Features

- Browse sneaker catalog
- Add/remove items from cart
- Admin-only dashboard to manage products (CRUD)
- User authentication and role-based access
- Responsive, mobile-friendly design

## 🛠 Tech Stack

### Frontend
- **React (Vite)**: Fast build and development tooling
- **Custom CSS**: Styling is handled through regular CSS files (e.g., index.css or component styles), allowing full control over layout and appearance without using a CSS framework.
- **AWS S3**: Hosts static `dist/` files for frontend deployment

### Backend & Cloud Infrastructure
- **Node.js (Lambda-based)**: Backend logic written as AWS Lambda functions
- **API Gateway**: Routes HTTP requests to Lambda functions
- **Amazon Aurora MySQL**: Cloud-managed relational database
- **AWS S3**: Stores sneaker images and other static assets
- **IAM Roles**: Securely grants Lambda and API Gateway controlled access to other AWS services (like S3 or Aurora)
- **AWS Secrets Manager**: Manages database credentials and other sensitive secrets

## ☁️ AWS Architecture
User ➝ (optional: CloudFront) ➝ S3 (frontend hosting)
⬇
API Gateway
⬇
Lambda (business logic)
⬇
Aurora MySQL DB (data)
⬇
S3 (image storage)

## 🧠 Design Considerations

- **Custom CSS** was chosen for full control over layout and design without relying on a CSS framework. Styles are defined in standard CSS files.

- The project initially used **Express.js**, but was later refactored into a fully serverless architecture using **AWS Lambda** and **API Gateway**, improving scalability and simplifying deployment.

- **Secrets Manager** was integrated to securely handle database credentials and secret keys, keeping them out of source code and under centralized AWS-managed access controls.

📦 Future Enhancements
Stripe or PayPal integration for payments

Product filtering and search functionality

Order history and checkout process

User-generated reviews and ratings

CI/CD deployment pipeline (GitHub Actions, AWS CodePipeline)

## 🔧 Setup Instructions

### Prerequisites
- Node.js, npm
- AWS account with:
  - S3 bucket for frontend
  - API Gateway & Lambda setup
  - Aurora MySQL DB
- MySQL client or ORM (e.g., Sequelize or Knex)
