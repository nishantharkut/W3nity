// // const mongoose = require("mongoose");

// // const activitySchema = new mongoose.Schema(
// //   {
// //     userId: { type: String, required: true },
// //     actionTitle: { type: String, required: true },
// //     context: { type: String },
// //     status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
// //     createdAt: { type: Date, default: Date.now },
// //   },
// //   { _id: false }
// // );

// // const dashboardSchema = new mongoose.Schema(
// //   {
// //     user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
// //     activeProjects: { type: Number, default: 0 },
// //     completedProjects: { type: Number, default: 0 },
// //     totalEarnings: { type: Number, default: 0 },
// //     network: { type: Number, default: 0 },
// //     recentActivities: [activitySchema],
// //   },
// //   { timestamps: true }
// // );

// // module.exports = mongoose.model("Dashboard", dashboardSchema);


// const mongoose = require("mongoose");
// const Proposal = require("../models/Proposal");
// const Gig = require("../models/Gig");
// const Activity = require("../models/Activity");

// const getDateRange = (type) => {
//   const now = new Date();
//   const start = new Date();
//   const end = new Date();

//   if (type === "thisWeek") {
//     const day = now.getDay();
//     const diff = now.getDate() - day + (day === 0 ? -6 : 1);
//     start.setDate(diff);
//     start.setHours(0, 0, 0, 0);
//     end.setDate(diff + 6);
//     end.setHours(23, 59, 59, 999);
//   }

//   if (type === "lastWeek") {
//     const day = now.getDay();
//     const diff = now.getDate() - day - 6;
//     start.setDate(diff);
//     start.setHours(0, 0, 0, 0);
//     end.setDate(diff + 6);
//     end.setHours(23, 59, 59, 999);
//   }

//   if (type === "thisMonth") {
//     start.setDate(1);
//     start.setHours(0, 0, 0, 0);
//     end.setMonth(start.getMonth() + 1, 0);
//     end.setHours(23, 59, 59, 999);
//   }

//   if (type === "lastMonth") {
//     start.setMonth(start.getMonth() - 1, 1);
//     start.setHours(0, 0, 0, 0);
//     end.setMonth(start.getMonth() + 1, 0);
//     end.setHours(23, 59, 59, 999);
//   }

//   return { start, end };
// };

// // Helper for time ago
// function timeAgo(date) {
//   const now = new Date();
//   const seconds = Math.floor((now - date) / 1000);
//   const intervals = {
//     year: 31536000,
//     month: 2592000,
//     day: 86400,
//     hour: 3600,
//     minute: 60,
//   };
//   for (let key in intervals) {
//     const interval = Math.floor(seconds / intervals[key]);
//     if (interval >= 1) return `${interval} ${key}${interval !== 1 ? "s" : ""} ago`;
//   }
//   return "Just now";
// }

// exports.getUserDashboard = async (req, res) => {
//   try {
//     const userId = req.params.userId;

//     // 📊 Live Calculations
//     const activeProjects = await Proposal.countDocuments({
//       user: userId,
//       status: "Accepted",
//     });

//     const completedProjects = await Proposal.countDocuments({
//       user: userId,
//       status: "FundReleased",
//     });

//     const earningsResult = await Proposal.aggregate([
//       {
//         $match: {
//           user: new mongoose.Types.ObjectId(userId),
//           status: "FundReleased",
//         },
//       },
//       {
//         $group: {
//           _id: null,
//           total: { $sum: "$budget" },
//         },
//       },
//     ]);
//     const totalEarnings = earningsResult[0]?.total || 0;

//     const networkUsers = await Proposal.aggregate([
//       { $match: { user: new mongoose.Types.ObjectId(userId) } },
//       {
//         $lookup: {
//           from: "gigs",
//           localField: "gig",
//           foreignField: "_id",
//           as: "gigInfo",
//         },
//       },
//       { $unwind: "$gigInfo" },
//       {
//         $group: {
//           _id: "$gigInfo.user",
//         },
//       },
//     ]);
//     const network = networkUsers.length;

//     const recentActivities = await Activity.find({ userId })
//       .sort({ createdAt: -1 })
//       .limit(5);

//     const formattedActivities = recentActivities.map((activity) => ({
//       actionTitle: activity.actionTitle,
//       context: activity.context,
//       status: activity.status,
//       time: timeAgo(activity.createdAt),
//     }));

//     // 📈 Change Stats
//     const currentWeekProjects = await Proposal.countDocuments({
//       user: userId,
//       status: "Accepted",
//       createdAt: getDateRange("thisWeek"),
//     });
//     const previousWeekProjects = await Proposal.countDocuments({
//       user: userId,
//       status: "Accepted",
//       createdAt: getDateRange("lastWeek"),
//     });
//     const projectChange = currentWeekProjects - previousWeekProjects;

//     const earningsThisMonth = await Proposal.aggregate([
//       {
//         $match: {
//           user: new mongoose.Types.ObjectId(userId),
//           status: "FundReleased",
//           createdAt: getDateRange("thisMonth"),
//         },
//       },
//       {
//         $group: {
//           _id: null,
//           total: { $sum: "$budget" },
//         },
//       },
//     ]);
//     const thisMonth = earningsThisMonth[0]?.total || 0;

//     const earningsLastMonth = await Proposal.aggregate([
//       {
//         $match: {
//           user: new mongoose.Types.ObjectId(userId),
//           status: "FundReleased",
//           createdAt: getDateRange("lastMonth"),
//         },
//       },
//       {
//         $group: {
//           _id: null,
//           total: { $sum: "$budget" },
//         },
//       },
//     ]);
//     const lastMonth = earningsLastMonth[0]?.total || 0;
//     const earningsChange = thisMonth - lastMonth;

//     const totalProjects = await Proposal.countDocuments({ user: userId });
//     const successRate =
//       totalProjects > 0 ? ((completedProjects / totalProjects) * 100).toFixed(1) : 0;

//     const newConnections = await Proposal.aggregate([
//       {
//         $match: {
//           user: new mongoose.Types.ObjectId(userId),
//           createdAt: getDateRange("thisWeek"),
//         },
//       },
//       {
//         $lookup: {
//           from: "gigs",
//           localField: "gig",
//           foreignField: "_id",
//           as: "gigInfo",
//         },
//       },
//       { $unwind: "$gigInfo" },
//       {
//         $group: {
//           _id: "$gigInfo.user",
//         },
//       },
//     ]);
//     const newConnectionsCount = newConnections.length;

//     // ✅ Final Combined Response
//     res.json({
//       activeProjects,
//       completedProjects,
//       totalEarnings,
//       network,
//       recentActivities: formattedActivities,
//       changeStats: {
//         projectChange,
//         earningsChange,
//         successRate,
//         newConnections: newConnectionsCount,
//       },
//     });
//   } catch (err) {
//     console.error("Dashboard error:", err);
//     res.status(500).json({ error: "Something went wrong" });
//   }
// };



const mongoose = require("mongoose");
const Proposal = require("../models/Proposal");
const Gig = require("../models/Gig");
const Activity = require("../models/Activity");
const Message = require("../models/Message"); // <- ADD THIS

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
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
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
    const network = networkUsers.length;

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
    const currentWeekProjects = await Proposal.countDocuments({
      user: userId,
      status: "Accepted",
      createdAt: getDateRange("thisWeek"),
    });

    const previousWeekProjects = await Proposal.countDocuments({
      user: userId,
      status: "Accepted",
      createdAt: getDateRange("lastWeek"),
    });

    const projectChange = currentWeekProjects - previousWeekProjects;

    const earningsThisMonth = await Proposal.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          status: "FundReleased",
          createdAt: getDateRange("thisMonth"),
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$budget" },
        },
      },
    ]);
    const thisMonth = earningsThisMonth[0]?.total || 0;

    const earningsLastMonth = await Proposal.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          status: "FundReleased",
          createdAt: getDateRange("lastMonth"),
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$budget" },
        },
      },
    ]);
    const lastMonth = earningsLastMonth[0]?.total || 0;
    const earningsChange = thisMonth - lastMonth;

    const totalProjects = await Proposal.countDocuments({ user: userId });
    const successRate =
      totalProjects > 0 ? ((completedProjects / totalProjects) * 100).toFixed(1) : 0;

    const newConnections = await Proposal.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          createdAt: getDateRange("thisWeek"),
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
    const newConnectionsCount = newConnections.length;

    // === PERFORMANCE METRICS ===
    const clientSatisfaction = 4.9; // placeholder

    const messages = await Message.find({ "sender._id": { $ne: userId } })
      .sort({ createdAt: 1 })
      .lean();

    let totalResponseTime = 0;
    let responseCount = 0;

    for (const msg of messages) {
      const reply = await Message.findOne({
        groupId: msg.groupId,
        "sender._id": mongoose.Types.ObjectId(userId),
        createdAt: { $gt: msg.createdAt },
      }).sort({ createdAt: 1 });

      if (reply) {
        const diff = new Date(reply.createdAt) - new Date(msg.createdAt);
        totalResponseTime += diff;
        responseCount++;
      }
    }

    const avgResponse = totalResponseTime / responseCount || 0;
    const responseTime =
      avgResponse < 3600000
        ? `< ${Math.ceil(avgResponse / 60000)} mins`
        : `< ${Math.ceil(avgResponse / 3600000)} hrs`;

    // ✅ Final Response
    res.json({
      activeProjects,
      completedProjects,
      totalEarnings,
      network,
      recentActivities: formattedActivities,
      changeStats: {
        projectChange,
        earningsChange,
        successRate,
        newConnections: newConnectionsCount,
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
