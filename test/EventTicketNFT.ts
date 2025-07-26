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

    return { eventTicketNFT, deployer, user1, user2, sampleURI };
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
      const { eventTicketNFT, user1, sampleURI } = await loadFixture(deployEventTicketNFTFixture);
      
      // Mint a token
      await eventTicketNFT.connect(user1).mintTicket(sampleURI);
      
      // Token ID should be 0 for first token
      const tokenId = 0;
      
      // Check token URI was set correctly
      expect(await eventTicketNFT.tokenURI(tokenId)).to.equal(sampleURI);
    });

    it("Should assign the token to the sender", async function () {
      const { eventTicketNFT, user1, sampleURI } = await loadFixture(deployEventTicketNFTFixture);
      
      // Mint a token
      await eventTicketNFT.connect(user1).mintTicket(sampleURI);
      
      // Token ID should be 0 for first token
      const tokenId = 0;
      
      // Check token ownership
      expect(await eventTicketNFT.ownerOf(tokenId)).to.equal(user1.address);
    });

    it("Should emit TicketMinted event", async function () {
      const { eventTicketNFT, user1, sampleURI } = await loadFixture(deployEventTicketNFTFixture);
      
      // Check event emission
      await expect(eventTicketNFT.connect(user1).mintTicket(sampleURI))
        .to.emit(eventTicketNFT, "TicketMinted")
        .withArgs(user1.address, 0, sampleURI);
    });

    it("Should return the correct token ID", async function () {
      const { eventTicketNFT, user1, sampleURI } = await loadFixture(deployEventTicketNFTFixture);
      
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
    it("Should handle multiple mints correctly", async function () {
      const { eventTicketNFT, deployer, user1, user2, sampleURI } = await loadFixture(deployEventTicketNFTFixture);
      
      // User1 mints a token using mintTicket
      await eventTicketNFT.connect(user1).mintTicket(sampleURI + "1");
      
      // User1 mints another token using mintTicket
      await eventTicketNFT.connect(user1).mintTicket(sampleURI + "3");
      
      // Owner safe mints a token to user2 (this uses a different counter)
      await eventTicketNFT.connect(deployer).safeMint(user2.address, sampleURI + "2");
      
      // Check ownership for mintTicket tokens
      expect(await eventTicketNFT.ownerOf(0)).to.equal(user1.address);
      expect(await eventTicketNFT.ownerOf(1)).to.equal(user1.address);
      
      // Check ownership for safeMint token (should use s_tokenIdCounter which starts at 0)
      expect(await eventTicketNFT.ownerOf(2)).to.equal(user2.address);
      
      // Check token URIs
      expect(await eventTicketNFT.tokenURI(0)).to.equal(sampleURI + "1");
      expect(await eventTicketNFT.tokenURI(1)).to.equal(sampleURI + "3");
      expect(await eventTicketNFT.tokenURI(2)).to.equal(sampleURI + "2");
      
      // Check final token counter from mintTicket
      expect(await eventTicketNFT.getTokenCounter()).to.equal(2);
    });

    it("Should track tokens separately between mintTicket and safeMint", async function () {
      const { eventTicketNFT, deployer, user1, sampleURI } = await loadFixture(deployEventTicketNFTFixture);
      
      // Use mintTicket - token ID 0
      await eventTicketNFT.connect(user1).mintTicket(sampleURI + "Regular");
      
      // Use safeMint - should not conflict with mintTicket's tokens
      await eventTicketNFT.connect(deployer).safeMint(user1.address, sampleURI + "Safe");
      
      // Check token URIs - safeMint should use a different ID counter
      expect(await eventTicketNFT.tokenURI(0)).to.equal(sampleURI + "Regular");
      expect(await eventTicketNFT.tokenURI(1)).to.equal(sampleURI + "Safe");
      
      // Only mintTicket should affect s_tokenCounter
      expect(await eventTicketNFT.getTokenCounter()).to.equal(1);
    });
  });
});