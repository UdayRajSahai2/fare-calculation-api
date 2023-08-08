# fare-calculation-api
This repository contains the code for a Fare Calculation REST API designed for a public metro transport payment system.
## Introduction

The Fare Calculation REST API provides a solution for calculating fares based on the zones and travel times in a public metro transport system. It also includes fare capping functionality for daily and weekly journeys.

## Prerequisites

Before setting up the API, ensure you have the following installed:

- Node.js
- MySQL

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/fare-calculation-api.git
   cd fare-calculation-api

   ##Install dependencies:
   npm init -y
   npm install express body-parser mysql2
   npm i jsonwebtoken

   ##Set up your MySQL database:

Create a new database named fare_db.

Usage

Start the server:
node server.js

Use Postman or any API client to test the API endpoints.

To authenticate, obtain a JWT token by sending a POST request to /login

Contributing
Contributions are welcome! Please fork the repository and create a pull request with your changes.
