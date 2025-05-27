const Event =require("../models/Event.js")


exports.createEvent = async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    const populatedEvent = await Event.findById(event._id).populate("organizer");
    return res.status(201).json(populatedEvent);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate("organizer");
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate("organizer","username avatar");
    return res.json(events);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("organizer");
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    return res.json(event);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};




exports.deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};