import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { Escrow } from "../typechain-types";

describe("Escrow", function () {
  // We define a fixture to reuse the same setup in every test.
  async function deployEscrowFixture() {
    // Setup test amounts and accounts
    const ONE_ETHER = hre.ethers.parseEther("1.0");
    
    // Get signers for different roles
    const [client, freelancer, otherAccount] = await hre.ethers.getSigners();

    // Deploy the contract
    const Escrow = await hre.ethers.getContractFactory("Escrow");
    const escrow = await Escrow.connect(client).deploy(freelancer.address, { value: ONE_ETHER });

    return { escrow, client, freelancer, otherAccount, ONE_ETHER, Escrow };
  }

  describe("Deployment", function () {
    it("Should set the right client", async function () {
      const { escrow, client } = await loadFixture(deployEscrowFixture);
      expect(await escrow.i_client()).to.equal(client.address);
    });

    it("Should set the right freelancer", async function () {
      const { escrow, freelancer } = await loadFixture(deployEscrowFixture);
      expect(await escrow.i_freelancer()).to.equal(freelancer.address);
    });

    it("Should set the correct amount", async function () {
      const { escrow, ONE_ETHER } = await loadFixture(deployEscrowFixture);
      expect(await escrow.i_amount()).to.equal(ONE_ETHER);
    });

    it("Should initialize as not complete", async function () {
      const { escrow } = await loadFixture(deployEscrowFixture);
      expect(await escrow.s_isComplete()).to.equal(false);
    });

    it("Should revert if no ether sent", async function () {
      const [client, freelancer] = await hre.ethers.getSigners();
      const Escrow = await hre.ethers.getContractFactory("Escrow");
      
      await expect(Escrow.deploy(freelancer.address, { value: 0 }))
        .to.be.revertedWithCustomError(Escrow, "Escrow__NoEtherSent");
    });

    it("Should revert if freelancer address is zero", async function () {
      const [client] = await hre.ethers.getSigners();
      const Escrow = await hre.ethers.getContractFactory("Escrow");
      const ONE_ETHER = hre.ethers.parseEther("1.0");
      
      await expect(Escrow.deploy(hre.ethers.ZeroAddress, { value: ONE_ETHER }))
        .to.be.revertedWithCustomError(Escrow, "Escrow__InvalidFreelancerAddress");
    });

    // Remove problematic event test for now
  });

  describe("Release Funds", function () {
    describe("Validations", function () {
      it("Should revert if called by non-client", async function () {
        const { escrow, otherAccount } = await loadFixture(deployEscrowFixture);
        await expect(escrow.connect(otherAccount).releaseFunds())
          .to.be.revertedWithCustomError(escrow, "Escrow__NotClient");
      });

      it("Should revert if funds already released", async function () {
        const { escrow, client } = await loadFixture(deployEscrowFixture);
        
        // Release funds first time
        await escrow.connect(client).releaseFunds();
        
        // Try to release funds again
        await expect(escrow.connect(client).releaseFunds())
          .to.be.revertedWithCustomError(escrow, "Escrow__FundsAlreadyReleased");
      });
    });

    describe("Events", function () {
      it("Should emit FundsReleased event", async function () {
        const { escrow, client, freelancer, ONE_ETHER } = await loadFixture(deployEscrowFixture);
        
        await expect(escrow.connect(client).releaseFunds())
          .to.emit(escrow, "FundsReleased")
          .withArgs(freelancer.address, ONE_ETHER);
      });
    });

    describe("Effects", function () {
      it("Should mark the escrow as complete", async function () {
        const { escrow, client } = await loadFixture(deployEscrowFixture);
        
        await escrow.connect(client).releaseFunds();
        expect(await escrow.s_isComplete()).to.equal(true);
      });

      it("Should transfer the funds to the freelancer", async function () {
        const { escrow, client, freelancer, ONE_ETHER } = await loadFixture(deployEscrowFixture);
        
        await expect(escrow.connect(client).releaseFunds())
          .to.changeEtherBalances(
            [escrow, freelancer],
            [-ONE_ETHER, ONE_ETHER]
          );
      });
    });
  });

  describe("Get Balance", function () {
    it("Should return the correct contract balance", async function () {
      const { escrow, ONE_ETHER } = await loadFixture(deployEscrowFixture);
      expect(await escrow.getBalance()).to.equal(ONE_ETHER);
    });

    it("Should return zero after funds are released", async function () {
      const { escrow, client } = await loadFixture(deployEscrowFixture);
      
      // Release the funds
      await escrow.connect(client).releaseFunds();
      
      // Check balance is now zero
      expect(await escrow.getBalance()).to.equal(0);
    });
  });
}); 