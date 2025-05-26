# 🚀 SparkVerse Nexus Hub

[![Demo](https://img.shields.io/badge/Live-Demo-blue)](https://preview--sparkverse-nexus-hub.lovable.app/)
[![Hackathon](https://img.shields.io/badge/Hackathon-Hack%20with%20Gujarat-brightgreen)](https://hackwithgujarat.org)

**SparkVerse Nexus Hub** (a.k.a. **W3nity**) is a unified, Web3-enabled collaboration platform that brings together:

- 🧑‍💻 **Freelancing Marketplace**  
- 🎉 **Event Management**  
- 💬 **Real-Time Community Chat**  

Designed and built in a 2.5-day sprint for **Hack with Gujarat**, SparkVerse lets startups, developers, and communities connect, collaborate, and transact seamlessly — on-chain or off-chain.

---

## 📌 Table of Contents

1. [Key Features](#-key-features)  
2. [Tech Stack](#-tech-stack)  
3. [Architecture](#-architecture)  
4. [Getting Started](#-getting-started)  
5. [Usage & Demo](#-usage--demo)  
6. [Roadmap](#-roadmap)  
7. [Contributing](#-contributing)  
8. [License](#-license)  

---

## ✨ Key Features

| Module                   | Description                                                                                   |
|--------------------------|-----------------------------------------------------------------------------------------------|
| **Freelancing**          | • Post & browse gigs<br>• Submit proposals & track status<br>• On-chain escrow smart contract |
| **Event Management**     | • Create/manage events<br>• Register & mint NFT tickets<br>• Admin dashboard & reminders     |
| **Community Chat**       | • Public & private channels<br>• 1:1 direct messaging<br>• Media sharing & history            |
| **Web3 Integration**     | • MetaMask wallet login<br>• Escrow.sol for payments<br>• ERC-721 minting for tickets        |

---

## 🛠️ Tech Stack

- **Frontend**  
  - Next.js (React) + Tailwind CSS  
  - Framer Motion for animations  
- **Backend**  
  - Node.js + Express  
  - MongoDB (Mongoose) or PostgreSQL (Prisma)  
- **Real-Time**  
  - Socket.IO (WebSockets) or Firebase Realtime DB  
- **Blockchain**  
  - Solidity & Hardhat (local/testnet)  
  - Ethers.js / Wagmi + MetaMask  
- **Storage & Media**  
  - AWS S3 or Cloudinary  
- **Deployment**  
  - Vercel (frontend) & Railway/Heroku (backend)  

---

## 🏗️ Architecture

---

## 🚀 Getting Started

1. **Clone the repo**  
   ```bash
   git clone https://github.com/yourusername/sparkverse-nexus-hub.git
   cd sparkverse-nexus-hub
   ```
2. **Install dependencies**
   ```bash
    # Frontend
    cd frontend && npm install

    # Backend
    cd ../backend && npm install
   ```
3. **Configure environment**
   - Copy example.env to .env in both frontend/ and backend/
   - Set your MongoDB/Postgres URI, MetaMask RPC endpoint, AWS/Cloudinary keys, etc.
4. **Run locally**
   ```bash
    # Run backend
    cd backend && npm run dev

    # Run frontend
    cd ../frontend && npm run dev
   ```
   
5. **(Optional) Deploy smart contracts**
   ```bash
    cd smart-contracts
    npx hardhat run scripts/deploy.js --network localhost
   ```

## 📺 Usage & Demo

- **Live Preview:**
    
    https://preview--sparkverse-nexus-hub.lovable.app/
    
- **Freelance Flow:**
    1. Connect MetaMask → 2. Post gig → 3. Submit proposal → 4. Deposit ETH in escrow → 5. Deliver & release funds.
- **Event Flow:**
    1. Create event → 2. Register → 3. Mint NFT ticket → 4. View/manage attendees.
- **Chat Flow:**
    1. Join global or project channels → 2. Send/receive messages → 3. Share files & media.

---

## 🗺️ Roadmap

- ✅ Core MVP: gigs, events, chat, Web3 login
- 🔄 User profiles & ratings
- 📊 Admin analytics dashboard
- 💳 Fiat payments (Stripe/Razorpay)
- 🤖 AI-powered gig recommendations
- 📱 Mobile-responsive & PWA support

---

## 🤝 Contributing

We welcome bug reports, feature requests, and pull requests!

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/AwesomeFeature`)
3. Commit your changes (`git commit -m 'Add AwesomeFeature'`)
4. Push to the branch (`git push origin feature/AwesomeFeature`)
5. Open a Pull Request

Please review our [CODE_OF_CONDUCT.md](https://www.notion.so/CODE_OF_CONDUCT.md) and [CONTRIBUTING.md](https://www.notion.so/CONTRIBUTING.md).

---

## 📄 License

Distributed under the MIT License. See [LICENSE](https://www.notion.so/LICENSE) for details.

---

### Built with ❤️ at **Hack with Gujarat**

**Hackathon:** [Hack with Gujarat](https://hackwithgujarat.org/)  |  **Team:** SparkVerse — Innovate, Collaborate, Elevated.
