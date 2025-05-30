# 🚀 W3nity - Web3 + Unity 
## All-in-One Tech Collaboration Platform

[![Demo](https://img.shields.io/badge/Live-Demo-blue)](https://preview--sparkverse-nexus-hub.lovable.app/)
[![Hackathon](https://img.shields.io/badge/Hackathon-Hack%20with%20Gujarat-brightgreen)](https://hackwithgujarat.org)

**W3nity** is a unified, Web3-enabled collaboration platform that brings together:

- 🧑‍💻 **Freelancing Marketplace**  
- 🎉 **Event Management**  
- 💬 **Real-Time Community Chat**  

Designed and built in a 2.5-day sprint for **Hack with Gujarat**, W3nity lets startups, developers, and communities connect, collaborate, and transact seamlessly — on-chain or off-chain.

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
  - Vite (React) + Tailwind CSS  
  - Framer Motion for animations  
- **Backend**  
  - Node.js + Express  
  - MongoDB (Mongoose)
- **Real-Time**  
  - Socket.IO (WebSockets)
- **Blockchain**  
  - Solidity & Hardhat (local/testnet)  
  - Ethers.js / Wagmi + MetaMask  
- **Storage & Media**  
  - Cloudinary  
- **Deployment**  
  - Vercel (frontend) & Railway/Heroku (backend)  

---

## 🏗️ Architecture

---

## 🚀 Getting Started

1. **Clone the repo**  
   ```bash
   git clone https://github.com/yourusername/W3nity.git
   cd W3nity
   ```
2. **Install dependencies**
   ```bash
    #Client
    cd client && npm install

    # Server
    cd ../server && npm install
   ```
3. **Configure environment**
   - Copy example.env to .env in both root dir, client/ and server/
   - Set your MongoDB URI , MetaMask RPC endpoint, AWS/Cloudinary keys, etc.
     

   ```bash
   # Example:
     PORT= 8080
     MONGO_URI="your MongoDb URI"
     JWT_SECRET="your JWT secret"
     STRIPE_SECRET_KEY="your stripe secret key"
     CLIENT_URL="your frontend ur"
     NFT_CONTRACT_ADDRESS="your contract address"
     SEPOLIA_RPC_URL="your sepolia url"
    ```
   
4. **Run locally**
   ```bash
    # Run backend
    cd server && npm run dev

    # Run frontend
    cd ../client && npm run dev

   #Run mint Listeners 
   npx tsx events/listenMintEvents.ts
   ```
  
   
5. **(Optional) Deploy smart contracts**
   ```bash
    cd smart-contracts
    npx hardhat run scripts/deploy.js --network localhost
   ```

## 📺 Usage & Demo

### 🔗 **Live Preview**
https://github.com/user-attachments/assets/cc042158-d2ca-4e0d-b470-fcf282571fea

---

### 🖼️ **Screenshots**

### 🧑‍💼 Freelance Marketplace

Connect MetaMask → Post Gig → Submit Proposal → Deposit ETH in Escrow → Deliver & Release

<img src="https://github.com/user-attachments/assets/17a982d2-841d-44e7-b51e-f386fa15aa78" alt="Freelance Proposal Page" width="800"/>

---

### 🎟️ Event Management & NFT Ticketing

Create Event → Register → Mint NFT Ticket → Manage Attendees

<img src="https://github.com/user-attachments/assets/29869cd7-7629-4422-9cfe-08ae59e6105e" alt="NFT Ticketing Page" width="800"/>

---

### 💬 Real-Time Chat System

Join Global or Project Channels → Send/Receive Messages → Share Files & Media

<img src="https://github.com/user-attachments/assets/92e1a960-4fb3-47e9-bcab-a759449113fc" alt="Community Chat" width="800"/>

---

### 🔐 MetaMask Login & Wallet Integration

Secure authentication and blockchain interaction using MetaMask.

<img src="https://github.com/user-attachments/assets/017c7fd9-a1f0-4424-9106-baffb9f6cd98" alt="MetaMask Login" width="800"/>

---

### 🛠️ Admin/Event Dashboard

<img src="https://github.com/user-attachments/assets/307a22cc-9cee-4713-b786-93fa46c0e959" alt="Admin Dashboard" width="800"/>

---

### 📄 Proposal & Contract Handling

<img src="https://github.com/user-attachments/assets/3272e54a-d922-4751-bb38-bf9b48fceae6" alt="Proposal Management" width="800"/>

---

### 🎮 User Flows

### 🔧 **Freelance Flow**

1. 🔗 Connect MetaMask
2. 📝 Post Gig
3. 📩 Submit Proposal
4. 💰 Deposit ETH in Escrow
5. ✅ Deliver Work & Release Payment

### 🎉 **Event Flow**

1. 🗓️ Create Event
2. ✍️ Register
3. 🧾 Mint NFT Ticket
4. 📋 View/Manage Attendees

### 💬 **Chat Flow**

1. 💬 Join Public/Private Channels
2. ✉️ Send Messages
3. 📎 Share Files & Media

---

## 🗺️ Roadmap

- ✅ Core MVP: gigs, events, chat, Web3 login, NFT Ticketing
- 🔄 User profiles & ratings
- 📊 Admin analytics dashboard
- 💳 Fiat payments (Stripe/Razorpay)
- 🤖 AI-powered gig recommendations [TO BE DONE]
- 📱 Mobile-responsive & PWA support [TO BE DONE]

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
![Visitor Count](https://profile-counter.glitch.me/nishantharkut-W3nity/count.svg)

### Built with ❤️ at **Hack with Gujarat**

**Hackathon:** [Hack with Gujarat](https://hackwithgujarat.org/)  |  **Team:** Null & Void — Innovate, Collaborate, Elevated.
