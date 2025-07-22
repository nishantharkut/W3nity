# W3nity - Web3 + Unity 

## All-in-One Tech Collaboration Platform

[![Demo](https://img.shields.io/badge/Live-Demo-green)](https://w3nity.vercel.app/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)


[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://nodejs.org)
[![Solidity](https://img.shields.io/badge/Solidity-%5E0.8.28-blue)](https://docs.soliditylang.org/)

<img src="assets/w3nity logo2.png" alt="W3nity Logo" width="200" align="right" style="margin-left: 20px;"/>

**W3nity** is a unified, Web3-enabled collaboration platform that brings together:

- **Freelancing Marketplace**
- **Event Management**
- **Real-Time Community Chat**



**W3nity** is a unified, Web3-enabled collaboration platform that brings together:

-  **Freelancing Marketplace**  
-  **Event Management**  
-  **Real-Time Community Chat**  

## 🔒 Security Features

- **Smart Contract Security**
  - OpenZeppelin secure base contracts
  - Comprehensive test coverage
  - External audit planned

- **Web Security**
  - JWT authentication
  - Rate limiting
  - Input validation
  - CORS protection

- **Data Privacy**
  - Encrypted storage
  - Secure key management
  - Regular backups

## ⚡ Performance

- **Frontend Optimization**
  - Code splitting
  - Lazy loading
  - Asset optimization
  - Caching strategies

- **Backend Efficiency**
  - Database indexing
  - Query optimization
  - Load balancing ready
  - Caching layers

- **Blockchain Integration**
  - Optimized gas usage
  - Batch transactions
  - Event listeners
  - Fallback providers

---

### W3nity lets startups, developers, and communities connect, collaborate, and transact seamlessly — on-chain or off-chain.

---

##  Table of Contents

1. [Key Features](#-key-features)  
2. [Tech Stack](#-tech-stack)  
3. [Architecture](#-architecture)
4. [Prerequisites](#-prerequisites)
5. [Getting Started](#-getting-started)  
6. [Usage & Demo](#-usage--demo)  
7. [Roadmap](#-roadmap)  
8. [Contributing](#-contributing)  
9. [License](#-license)  

---

##  Key Features

| Module                   | Description                                                                                   |
|--------------------------|-----------------------------------------------------------------------------------------------|
| **Freelancing**          | • Post & browse gigs<br>• Submit proposals & track status<br>• On-chain escrow smart contract |
| **Event Management**     | • Create/manage events<br>• Register & mint NFT tickets<br>• Admin dashboard & reminders     |
| **Community Chat**       | • Public & private channels<br>• 1:1 direct messaging<br>• Media sharing & history            |
| **Web3 Integration**     | • MetaMask wallet login<br>• Escrow.sol for payments<br>• ERC-721 minting for tickets        |

---

## Tech Stack

- **Frontend**  
  - React + Typescript + Tailwind CSS  
  - Framer Motion for animations  
- **Backend**  
  - Node.js + Express  
  - MongoDB (Mongoose) for database
- **Real-Time**  
  - Socket.IO (WebSockets) for community chat
- **Blockchain**  
  - Solidity & Hardhat (local/testnet)
  - Alchemy
  - Ethers.js / Wagmi + MetaMask  
- **Storage & Media**  
  - Cloudinary [Planned]
- **Deployment**  
  - Vercel (frontend) & Render (backend)  

---

##  Architecture
![architectureee](https://github.com/user-attachments/assets/5beace3e-b41d-4781-a68c-0a091d9b0cc3)

---

### System Components
- **Frontend**: React SPA with TypeScript and Tailwind CSS
- **Backend**: RESTful API with Express, real-time WebSocket server
- **Database**: MongoDB for user data, events, and transactions
- **Blockchain**: Smart contracts for tickets and payments
- **Storage**: IPFS for decentralized content storage

---

## 📋 Prerequisites

- Node.js >= 14.0.0
- npm >= 6.14.0
- MongoDB >= 4.4
- MetaMask wallet
- Git


##  Getting Started

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
  # --- Server ---
  PORT= 8080
  MONGO_URI="your MongoDb URI"
  JWT_SECRET="your JWT secret"
  SEPOLIA_RPC_URL="your sepolia url"
  NFT_CONTRACT_ADDRESS="your contract address"
  STRIPE_SECRET_KEY="your stripe secret key"
  CLIENT_URL="your frontend ur"
  
  # --- Client ---
  VITE_API_URL="your backend URL"
  
  # --- Root Folder ---
  SEPOLIA_RPC_URL="your sepolia url"
  PRIVATE_KEY="your escrow id"
  MONGO_URI="your MongoDb URI"
  NFT_CONTRACT_ADDRESS="your contract address"

```
> ⚠️ **Security Notes**: 
> - Never commit `.env` files to version control
> - Use strong secrets for JWT_SECRET
> - Keep your private keys secure
> - Use test API keys for development
   
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

##  Usage & Demo

###  Demo Video  

https://github.com/user-attachments/assets/cc042158-d2ca-4e0d-b470-fcf282571fea

---

###  **Screenshots**

<table>
  <tr>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/17a982d2-841d-44e7-b51e-f386fa15aa78" alt="Onboarding Page" width="350"/><br/>
      <strong> Onboarding</strong><br/>
      <span style="font-size: 0.8em; color: #666;">Wallet Connect & MetaMask Auth</span>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/29869cd7-7629-4422-9cfe-08ae59e6105e" alt="Dashboard" width="350"/><br/>
      <strong> Dashboard</strong><br/>
      <span style="font-size: 0.8em; color: #666;">Your Gateway to Freelance, Events, and Chat</span>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/92e1a960-4fb3-47e9-bcab-a759449113fc" alt="Freelance Marketplace" width="350"/><br/>
      <strong> Freelancing</strong><br/>
      <span style="font-size: 0.8em; color: #666;">Post Gigs, Submit Proposals, Escrow ETH</span>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/017c7fd9-a1f0-4424-9106-baffb9f6cd98" alt="Event Management" width="350"/><br/>
      <strong> Events</strong><br/>
      <span style="font-size: 0.8em; color: #666;">Create Events & Mint NFT Tickets</span>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/307a22cc-9cee-4713-b786-93fa46c0e959" alt="Community Chat" width="350"/><br/>
      <strong> Community</strong><br/>
      <span style="font-size: 0.8em; color: #666;">Real-time Global & Private Chat</span>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/3272e54a-d922-4751-bb38-bf9b48fceae6" alt="Profile Page" width="350"/><br/>
      <strong> Profile</strong><br/>
      <span style="font-size: 0.8em; color: #666;">Track Proposals, Projects & Tickets</span>
    </td>
  </tr>
</table>


---

### User Flows

### **Freelance Flow**

1. Connect MetaMask
2. Post Gig
3. Submit Proposal
4. Deposit ETH in Escrow
5. Deliver Work & Release Payment

### **Event Flow**

1. Create Event
2. Register
3. Mint NFT Ticket
4. View/Manage Attendees

### **Chat Flow**

1. Join Public/Private Channels
2. Send Messages
3. Share Files & Media

---

## 🛣️ Roadmap

### Phase 1: Core Platform (Completed ✅)
- ✅ Web3 login with MetaMask integration
- ✅ Freelance marketplace with escrow
- ✅ Event management with NFT ticketing
- ✅ Real-time community chat

### Phase 2: Enhanced Features (In Progress 🚀)
- 🏗️ User profiles and reputation system
- 🏗️ Advanced search and filtering
- 🏗️ Admin analytics dashboard
- 🏗️ Fast payments (Stripe/Razorpay)

### Phase 3: Future Expansion (Planned 📋)
- 📅 AI-powered gig recommendations
- 📅 Mobile-responsive & PWA support
- 📅 Multi-chain support
- 📅 DAO governance implementation

### Phase 4: Platform Scale (Upcoming 🔮)
- 🎯 Enhanced security features
- 🎯 Performance optimizations
- 🎯 Advanced analytics
- 🎯 Community governance

---

## Contributing

Please follow the Code of Conducts and Learn.md documentations properly.
We welcome bug reports, feature requests, and pull requests!

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/AwesomeFeature`)
3. Commit your changes (`git commit -m 'Add AwesomeFeature'`)
4. Push to the branch (`git push origin feature/AwesomeFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📫 Contact & Support

- **Issues**: Use GitHub Issues for bugs and feature requests
- **Discussions**: Join project discussions on GitHub

## 🙏 Acknowledgments

- [OpenZeppelin](https://www.openzeppelin.com/) for smart contract libraries
- [Ethers.js](https://docs.ethers.org/) for blockchain interactions
- [Socket.io](https://socket.io/) for real-time features
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Hardhat](https://hardhat.org/) for smart contract development

---
[![Visitors](https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2Fnishantharkut%2FW3nity&count_bg=%2379C83D&title_bg=%23555555&icon=&icon_color=%23E7E7E7&title=visitors&edge_flat=false)](https://hits.seeyoufarm.com)
