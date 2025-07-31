const express=require("express")
const router=express.Router();
const Project=require("../models/Project.js")
const authMiddleware= require("../middlewares/authMiddleware.js")
const logActivity = require("../utils/logActivity.js");


router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Fetching projects for userId:", id);

    const projects = await Project.find({ userId: id });  // ✅ Correct usage
    console.log("Projects found:", projects);

    res.json(projects);
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).json({ message: err.message });
  }
});




// Add a new project
router.post("/", authMiddleware,async (req, res) => {
  const { title, description, technologies, status, client, budget, progress } = req.body;
//  console.log(req.user._id)
  const project = new Project({
    title,
    description,
    technologies,
    status,
    client,
    budget,
    userId: req.user._id,
    progress,
  });

  try {
    const savedProject = await project.save();
    console.log(savedProject)
    await logActivity({
      userId: req.user._id,
      actionTitle: `New Project Created: ${title}`,
      context: "Project Management",
      status: "completed",
    });
    return res.status(201).json(savedProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;