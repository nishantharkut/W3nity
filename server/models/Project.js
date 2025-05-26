const mongoose=require("mongoose")
const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  technologies: [String],
  status: String,
  client: String,
  budget: String,
});

module.exports = mongoose.model("Project", projectSchema);