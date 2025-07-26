import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("EventTicketNFT", function () {
  // We define a fixture to reuse the same setup in every test.
  async function deployEventTicketNFTFixture() {
    // Get signers for different roles
    const [deployer, user1, user2] = await hre.ethers.getSigners();

    // Deploy the contract
    const EventTicketNFT = await hre.ethers.getContractFactory("EventTicketNFT");
    const eventTicketNFT = await EventTicketNFT.deploy(deployer.address);
    
    // Sample token URI
    const sampleURI = "ipfs://QmSampleIPFSHash";

    // Constant for mintTicket offset
    const MINT_TICKET_OFFSET = 1_000_000;

    return { eventTicketNFT, deployer, user1, user2, sampleURI, MINT_TICKET_OFFSET };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { eventTicketNFT, deployer } = await loadFixture(deployEventTicketNFTFixture);
      expect(await eventTicketNFT.owner()).to.equal(deployer.address);
    });

    it("Should initialize token counter to zero", async function () {
      const { eventTicketNFT } = await loadFixture(deployEventTicketNFTFixture);
      expect(await eventTicketNFT.getTokenCounter()).to.equal(0);
    });

    it("Should revert if owner address is zero", async function () {
      const EventTicketNFT = await hre.ethers.getContractFactory("EventTicketNFT");
      
      await expect(EventTicketNFT.deploy(hre.ethers.ZeroAddress))
        .to.be.revertedWithCustomError(EventTicketNFT, "EventTicketNFT__InvalidOwnerAddress");
    });
  });

  describe("mintTicket", function () {
    it("Should allow anyone to mint a ticket", async function () {
      const { eventTicketNFT, user1, sampleURI } = await loadFixture(deployEventTicketNFTFixture);
      
      await expect(eventTicketNFT.connect(user1).mintTicket(sampleURI))
        .to.not.be.reverted;
    });

    it("Should revert if tokenURI is empty", async function () {
      const { eventTicketNFT, user1 } = await loadFixture(deployEventTicketNFTFixture);
      
      await expect(eventTicketNFT.connect(user1).mintTicket(""))
        .to.be.revertedWithCustomError(eventTicketNFT, "EventTicketNFT__EmptyTokenURI");
    });

    it("Should increment token counter after minting", async function () {
      const { eventTicketNFT, user1, sampleURI } = await loadFixture(deployEventTicketNFTFixture);
      
      // Mint a token
      await eventTicketNFT.connect(user1).mintTicket(sampleURI);
      
      // Check token counter was incremented
      expect(await eventTicketNFT.getTokenCounter()).to.equal(1);
    });

    it("Should set correct token URI", async function () {
      const { eventTicketNFT, user1, sampleURI, MINT_TICKET_OFFSET } = await loadFixture(deployEventTicketNFTFixture);
      
      // Mint a token
      await eventTicketNFT.connect(user1).mintTicket(sampleURI);
      
      // Token ID should be MINT_TICKET_OFFSET for first token
      const tokenId = MINT_TICKET_OFFSET;
      
      // Check token URI was set correctly
      expect(await eventTicketNFT.tokenURI(tokenId)).to.equal(sampleURI);
    });

    it("Should assign the token to the sender", async function () {
      const { eventTicketNFT, user1, sampleURI, MINT_TICKET_OFFSET } = await loadFixture(deployEventTicketNFTFixture);
      
      // Mint a token
      await eventTicketNFT.connect(user1).mintTicket(sampleURI);
      
      // Token ID should be MINT_TICKET_OFFSET for first token
      const tokenId = MINT_TICKET_OFFSET;
      
      // Check token ownership
      expect(await eventTicketNFT.ownerOf(tokenId)).to.equal(user1.address);
    });

    it("Should emit TicketMinted event", async function () {
      const { eventTicketNFT, user1, sampleURI, MINT_TICKET_OFFSET } = await loadFixture(deployEventTicketNFTFixture);
      
      // Check event emission
      await expect(eventTicketNFT.connect(user1).mintTicket(sampleURI))
        .to.emit(eventTicketNFT, "TicketMinted")
        .withArgs(user1.address, MINT_TICKET_OFFSET, sampleURI);
    });

    it("Should return the correct token ID", async function () {
      const { eventTicketNFT, user1, sampleURI, MINT_TICKET_OFFSET } = await loadFixture(deployEventTicketNFTFixture);
      
      // Mint a token and capture returned ID
      const tx = await eventTicketNFT.connect(user1).mintTicket(sampleURI);
      const receipt = await tx.wait();
      
      // Mint another token
      await eventTicketNFT.connect(user1).mintTicket(sampleURI);
      
      // ID should be sequential
      expect(await eventTicketNFT.getTokenCounter()).to.equal(2);
    });
  });

  describe("safeMint", function () {
    it("Should allow only owner to safe mint", async function () {
      const { eventTicketNFT, deployer, user1, sampleURI } = await loadFixture(deployEventTicketNFTFixture);
      
      // Owner can safe mint
      await expect(eventTicketNFT.connect(deployer).safeMint(user1.address, sampleURI))
        .to.not.be.reverted;
    });

    it("Should revert if non-owner tries to safe mint", async function () {
      const { eventTicketNFT, user1, user2, sampleURI } = await loadFixture(deployEventTicketNFTFixture);
      
      // Non-owner cannot safe mint
      await expect(eventTicketNFT.connect(user1).safeMint(user2.address, sampleURI))
        .to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should revert if recipient address is zero", async function () {
      const { eventTicketNFT, deployer, sampleURI } = await loadFixture(deployEventTicketNFTFixture);
      
      await expect(eventTicketNFT.connect(deployer).safeMint(hre.ethers.ZeroAddress, sampleURI))
        .to.be.revertedWithCustomError(eventTicketNFT, "EventTicketNFT__InvalidRecipientAddress");
    });

    it("Should revert if URI is empty", async function () {
      const { eventTicketNFT, deployer, user1 } = await loadFixture(deployEventTicketNFTFixture);
      
      await expect(eventTicketNFT.connect(deployer).safeMint(user1.address, ""))
        .to.be.revertedWithCustomError(eventTicketNFT, "EventTicketNFT__EmptyTokenURI");
    });

    it("Should increment the token ID counter", async function () {
      const { eventTicketNFT, deployer, user1, sampleURI } = await loadFixture(deployEventTicketNFTFixture);
      
      // Safe mint a token
      await eventTicketNFT.connect(deployer).safeMint(user1.address, sampleURI);
      
      // Token ID counter should be incremented
      expect(await eventTicketNFT.ownerOf(0)).to.equal(user1.address);
    });

    it("Should emit TicketMinted event", async function () {
      const { eventTicketNFT, deployer, user1, sampleURI } = await loadFixture(deployEventTicketNFTFixture);
      
      // Check event emission
      await expect(eventTicketNFT.connect(deployer).safeMint(user1.address, sampleURI))
        .to.emit(eventTicketNFT, "TicketMinted")
        .withArgs(user1.address, 0, sampleURI);
    });

    it("Should set correct token URI", async function () {
      const { eventTicketNFT, deployer, user1, sampleURI } = await loadFixture(deployEventTicketNFTFixture);
      
      // Safe mint a token
      await eventTicketNFT.connect(deployer).safeMint(user1.address, sampleURI);
      
      // Check token URI was set correctly
      expect(await eventTicketNFT.tokenURI(0)).to.equal(sampleURI);
    });
  });

  describe("Integration Tests", function () {
    // Create a separate fixture for integration tests to avoid ID conflicts
    async function deployIntegrationFixture() {
      // Get signers for different roles
      const [deployer, user1, user2] = await hre.ethers.getSigners();

      // Deploy the contract
      const EventTicketNFT = await hre.ethers.getContractFactory("EventTicketNFT");
      const eventTicketNFT = await EventTicketNFT.deploy(deployer.address);
      
      // Sample token URI
      const sampleURI = "ipfs://QmSampleIPFSHash";

      // Constant for mintTicket offset
      const MINT_TICKET_OFFSET = 1_000_000;

      return { eventTicketNFT, deployer, user1, user2, sampleURI, MINT_TICKET_OFFSET };
    }

    it("Should handle minting from both functions separately", async function () {
      const { eventTicketNFT, deployer, user1, user2, sampleURI, MINT_TICKET_OFFSET } = await loadFixture(deployIntegrationFixture);
      
      // Use safeMint - these use IDs starting at 0
      const safeId1 = await eventTicketNFT.connect(deployer).safeMint(user2.address, sampleURI + "Safe1").then(tx => tx.wait());
      const safeId2 = await eventTicketNFT.connect(deployer).safeMint(user2.address, sampleURI + "Safe2").then(tx => tx.wait());
      
      // Use mintTicket - these use IDs starting at MINT_TICKET_OFFSET
      const regularId1 = await eventTicketNFT.connect(user1).mintTicket(sampleURI + "Regular1").then(tx => tx.wait());
      const regularId2 = await eventTicketNFT.connect(user1).mintTicket(sampleURI + "Regular2").then(tx => tx.wait());
      
      // Verify token ownership
      expect(await eventTicketNFT.ownerOf(0)).to.equal(user2.address); // safeMint token
      expect(await eventTicketNFT.ownerOf(1)).to.equal(user2.address); // safeMint token
      expect(await eventTicketNFT.ownerOf(MINT_TICKET_OFFSET)).to.equal(user1.address); // mintTicket token
      expect(await eventTicketNFT.ownerOf(MINT_TICKET_OFFSET + 1)).to.equal(user1.address); // mintTicket token
      
      // Verify token URIs
      expect(await eventTicketNFT.tokenURI(0)).to.equal(sampleURI + "Safe1");
      expect(await eventTicketNFT.tokenURI(1)).to.equal(sampleURI + "Safe2");
      expect(await eventTicketNFT.tokenURI(MINT_TICKET_OFFSET)).to.equal(sampleURI + "Regular1");
      expect(await eventTicketNFT.tokenURI(MINT_TICKET_OFFSET + 1)).to.equal(sampleURI + "Regular2");
      
      // Verify token counter (only affected by mintTicket)
      expect(await eventTicketNFT.getTokenCounter()).to.equal(2);
    });

    it("Should manage token counters correctly", async function () {
      const { eventTicketNFT, deployer, user1, sampleURI, MINT_TICKET_OFFSET } = await loadFixture(deployIntegrationFixture);
      
      // Use both minting functions
      await eventTicketNFT.connect(deployer).safeMint(user1.address, sampleURI + "SafeFirst");
      await eventTicketNFT.connect(user1).mintTicket(sampleURI + "RegularAfter");
      
      // Check token ownership - these should be in completely separate ID spaces now
      expect(await eventTicketNFT.ownerOf(0)).to.equal(user1.address); // From safeMint
      expect(await eventTicketNFT.ownerOf(MINT_TICKET_OFFSET)).to.equal(user1.address); // From mintTicket
      
      // Check token URIs
      expect(await eventTicketNFT.tokenURI(0)).to.equal(sampleURI + "SafeFirst");
      expect(await eventTicketNFT.tokenURI(MINT_TICKET_OFFSET)).to.equal(sampleURI + "RegularAfter");
      
      // Only mintTicket affects s_tokenCounter
      expect(await eventTicketNFT.getTokenCounter()).to.equal(1);
    });
  });
});