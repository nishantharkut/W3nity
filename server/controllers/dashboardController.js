const mongoose = require("mongoose");
const User = require("../models/User");
const Activity = require("../models/Activity");
const Proposal = require("../models/Proposal");
const Message = require("../models/Message");

// Optional: import your helper functions
const {
  getActiveProjectsThisWeek,
  getActiveProjectsLastWeek,
  getEarningsThisMonth,
  getEarningsLastMonth,
  getCompletedProjects,
  getTotalProjects,
  getNewConnectionsThisWeek,
  getTotalConnections,
} = require("../helpers/dashboardHelpers");

exports.getUserDashboard = async (req, res) => {
  try {
    const userId = req.params.userId;

    // === Base Stats ===
    const activeProjects = await Proposal.countDocuments({
      user: userId,
      status: "Accepted",
    });

    const completedProjects = await Proposal.countDocuments({
      user: userId,
      status: "FundReleased",
    });

    const earningsResult = await Proposal.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          status: "FundReleased",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$budget" },
        },
      },
    ]);
    const totalEarnings = earningsResult[0]?.total || 0;

    const networkUsers = await Proposal.aggregate([
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
    const networkCount = networkUsers.length;

    // === Recent Activities ===
    const recentActivities = await Activity.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5);

    const formattedActivities = recentActivities.map((activity) => ({
      actionTitle: activity.actionTitle,
      context: activity.context,
      status: activity.status,
      time: timeAgo(activity.createdAt),
    }));

    // === Change Stats ===
    const currentWeekProjects = await getActiveProjectsThisWeek(userId);
    const previousWeekProjects = await getActiveProjectsLastWeek(userId);
    const projectChange = currentWeekProjects - previousWeekProjects;

    const earningsThisMonth = await getEarningsThisMonth(userId);
    const earningsLastMonth = await getEarningsLastMonth(userId);
    const earningsChange = earningsThisMonth - earningsLastMonth;

    const totalProjects = await getTotalProjects(userId);
    const successRate = totalProjects > 0
      ? ((completedProjects / totalProjects) * 100).toFixed(1)
      : 0;

    const newConnections = await getNewConnectionsThisWeek(userId);

    // === Performance Metrics ===

    // Client Satisfaction: (Mocked - replace with actual average from reviews later)
    const clientSatisfaction = 4.9;

    // Response Time Calculation (based on first reply after receiving a message)
    const messages = await Message.find({ "sender._id": { $ne: userId } })
      .sort({ createdAt: 1 })
      .lean();

    let totalResponseTime = 0;
    let responseCount = 0;

    for (const msg of messages) {
      const reply = await Message.findOne({
        groupId: msg.groupId,
        "sender._id": userId,
        createdAt: { $gt: msg.createdAt },
      }).sort({ createdAt: 1 });

      if (reply) {
        const diffInMs = new Date(reply.createdAt) - new Date(msg.createdAt);
        totalResponseTime += diffInMs;
        responseCount++;
      }
    }

    let avgResponse = totalResponseTime / responseCount || 0;
    let responseTime =
      avgResponse < 3600000
        ? `< ${Math.ceil(avgResponse / 60000)} mins`
        : `< ${Math.ceil(avgResponse / 3600000)} hrs`;

    // === Final Response ===
    res.json({
      activeProjects,
      completedProjects,
      totalEarnings,
      network: networkCount,
      recentActivities: formattedActivities,
      changeStats: {
        projectChange,
        earningsChange,
        successRate,
        newConnections,
      },
      performance: {
        successRate,
        clientSatisfaction,
        responseTime,
      },
    });

  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Helper
function timeAgo(date) {
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (let key in intervals) {
    const interval = Math.floor(seconds / intervals[key]);
    if (interval >= 1) return `${interval} ${key}${interval !== 1 ? "s" : ""} ago`;
  }

  return "Just now";
}
