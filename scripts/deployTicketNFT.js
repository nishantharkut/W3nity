const hre = require("hardhat");

async function main() {
  const TicketNFT = await hre.ethers.getContractFactory("EventTicketNFT");
  const ticketNFT = await TicketNFT.deploy();

  await ticketNFT.deployed();

  console.log("EventTicketNFT deployed to:", ticketNFT.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
