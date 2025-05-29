const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  const EventTicketNFT = await hre.ethers.getContractFactory("EventTicketNFT");
  const eventTicket = await EventTicketNFT.deploy(deployer.address);
  await eventTicket.waitForDeployment();

  console.log(`✅ EventTicketNFT deployed to: ${eventTicket.target}`);

  // === (OPTIONAL) DEPLOY ESCROW CONTRACT ===
  // Uncomment if you want to deploy Escrow again
  const freelancerAddress = "0xEe9B179cA16Cb4e6E9c89B3B586a8f484d2b656c";
  const Escrow = await hre.ethers.getContractFactory("Escrow");
  const escrow = await Escrow.deploy(freelancerAddress, {
    value: hre.ethers.parseEther("0.01"),
  });
  await escrow.waitForDeployment();
  console.log(`✅ Escrow deployed to: ${escrow.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
