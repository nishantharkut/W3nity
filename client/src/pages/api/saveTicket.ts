// pages/api/saveTicket.ts
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const { walletAddress, tokenId, tokenURI, txHash } = req.body;

  try {
    const saved = await prisma.ticket.create({
      data: {
        walletAddress,
        tokenId,
        tokenURI,
        txHash,
      },
    });

    return res.status(200).json({ message: "Saved", ticket: saved });
  } catch (err) {
    console.error("DB Save Error:", err);
    return res.status(500).json({ message: "Failed to save ticket" });
  }
}
