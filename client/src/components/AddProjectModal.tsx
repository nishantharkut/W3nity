import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  status: string;
  client: string;
  budget: string;
}

interface AddProjectModalProps {
  onAddProject: (project: Project) => void;
}

const AddProjectModal: React.FC<AddProjectModalProps> = ({ onAddProject }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [status, setStatus] = useState("In Progress");
  const [client, setClient] = useState("");
  const [budget, setBudget] = useState("");

  const handleSubmit = async () => {
    if (!title || !description) {
      alert("Please fill in title and description");
      return;
    }

    const newProject: Project = {
      id: Date.now().toString(),
      title,
      description,
      technologies: technologies
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      status,
      client,
      budget,
    };

    try {
      const response = await fetch("http://localhost:8080/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProject),
      });

      if (!response.ok) {
        throw new Error("Failed to add project");
      }
      console.log(response)
      const savedProject = await response.json();
      onAddProject(savedProject);
      setOpen(false);

      // Reset form
      setTitle("");
      setDescription("");
      setTechnologies("");
      setStatus("In Progress");
      setClient("");
      setBudget("");
    } catch (error) {
      console.error("Error adding project:", error);
      alert("There was an error adding the project. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add New Project</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Project</DialogTitle>
          <DialogDescription>
            Enter the details of your new project below.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <Input
            placeholder="Project Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            placeholder="Project Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Input
            placeholder="Technologies (comma separated)"
            value={technologies}
            onChange={(e) => setTechnologies(e.target.value)}
          />
          <Input
            placeholder="Status (Completed / In Progress)"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          />
          <Input
            placeholder="Client"
            value={client}
            onChange={(e) => setClient(e.target.value)}
          />
          <Input
            placeholder="Budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Add Project</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddProjectModal;
