const mongoose = require("mongoose");
const Proposal = require("../models/Proposal");

const getDateRange = (type) => {
  const now = new Date();
  const start = new Date();
  const end = new Date();

  if (type === "thisWeek") {
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);
    start.setHours(0, 0, 0, 0);
    end.setDate(diff + 6);
    end.setHours(23, 59, 59, 999);
  }

  if (type === "lastWeek") {
    const day = now.getDay();
    const diff = now.getDate() - day - 6;
    start.setDate(diff);
    start.setHours(0, 0, 0, 0);
    end.setDate(diff + 6);
    end.setHours(23, 59, 59, 999);
  }

  if (type === "thisMonth") {
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
    end.setMonth(start.getMonth() + 1, 0);
    end.setHours(23, 59, 59, 999);
  }

  if (type === "lastMonth") {
    start.setMonth(start.getMonth() - 1, 1);
    start.setHours(0, 0, 0, 0);
    end.setMonth(start.getMonth() + 1, 0);
    end.setHours(23, 59, 59, 999);
  }

  return { start, end };
};

// 🧮 Reusable helpers:
const getActiveProjectsThisWeek = async (userId) => {
  const { start, end } = getDateRange("thisWeek");
  return await Proposal.countDocuments({
    user: userId,
    status: "Accepted",
    createdAt: { $gte: start, $lte: end },
  });
};

const getActiveProjectsLastWeek = async (userId) => {
  const { start, end } = getDateRange("lastWeek");
  return await Proposal.countDocuments({
    user: userId,
    status: "Accepted",
    createdAt: { $gte: start, $lte: end },
  });
};

const getEarningsThisMonth = async (userId) => {
  const { start, end } = getDateRange("thisMonth");
  const result = await Proposal.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        status: "FundReleased",
        createdAt: { $gte: start, $lte: end },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$budget" },
      },
    },
  ]);
  return result[0]?.total || 0;
};

const getEarningsLastMonth = async (userId) => {
  const { start, end } = getDateRange("lastMonth");
  const result = await Proposal.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        status: "FundReleased",
        createdAt: { $gte: start, $lte: end },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$budget" },
      },
    },
  ]);
  return result[0]?.total || 0;
};

const getTotalProjects = async (userId) => {
  return await Proposal.countDocuments({ user: userId });
};

const getCompletedProjects = async (userId) => {
  return await Proposal.countDocuments({
    user: userId,
    status: "FundReleased",
  });
};

const getNewConnectionsThisWeek = async (userId) => {
  const { start, end } = getDateRange("thisWeek");
  const result = await Proposal.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        createdAt: { $gte: start, $lte: end },
      },
    },
    {
      $lookup: {
        from: "gigs",
        localField: "gig",
        foreignField: "_id",
        as: "gigInfo",
      },
    },
    { $unwind: "$gigInfo" },
    {
      $group: {
        _id: "$gigInfo.user",
      },
    },
  ]);
  return result.length;
};

const getTotalConnections = async (userId) => {
  const result = await Proposal.aggregate([
    {
      $match: { user: new mongoose.Types.ObjectId(userId) },
    },
    {
      $lookup: {
        from: "gigs",
        localField: "gig",
        foreignField: "_id",
        as: "gigInfo",
      },
    },
    { $unwind: "$gigInfo" },
    {
      $group: {
        _id: "$gigInfo.user",
      },
    },
  ]);
  return result.length;
};

module.exports = {
  getDateRange,
  getActiveProjectsThisWeek,
  getActiveProjectsLastWeek,
  getEarningsThisMonth,
  getEarningsLastMonth,
  getCompletedProjects,
  getTotalProjects,
  getNewConnectionsThisWeek,
  getTotalConnections,
};
