const express=require("express")
const router=express.Router();
const Project=require("../models/Project.js")

router.get("/", async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new project
router.post("/", async (req, res) => {
  const { title, description, technologies, status, client, budget } = req.body;

  const project = new Project({
    title,
    description,
    technologies,
    status,
    client,
    budget,
  });

  try {
    const savedProject = await project.save();
    return res.status(201).json(savedProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;