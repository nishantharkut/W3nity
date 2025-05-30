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
  const freelancerAddress = "0x07D8493B31cd500ec8e11534f052Da94F47C9A97";
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
