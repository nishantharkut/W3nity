const express = require('express');
const router = express.Router();
const Group = require('../models/Group');


router.get('/', async (req, res) => {
  try {
    const groups = await Group.find().populate('members', '_id username email');
    res.json(groups);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get('/:id', async (req, res) => {
  try {
    const groups = await Group.findById(req.params.id);
    res.json(groups);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post('/', async (req, res) => {
   try {
    const { name, description, type, userId } = req.body;

    const newGroup = new Group({
      name,
      description,
      type,
      members: [userId], 
      lastActivity: new Date(),
    });

    const savedGroup = await newGroup.save();
    res.status(201).json(savedGroup);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create group' });
  }
});


router.post('/:id/join', async (req, res) => {
  const {id: userId } = req.body;
  console.log(userId)
  console.log(req.params.id)
  try {
    const group = await Group.findById(req.params.id);
    

    if (!group) return res.status(404).json({ message: 'Group not found' });

    if (!group.members.includes(userId)) {
      group.members.push(userId);
      await group.save();
    }

    res.status(200).json(group);
  } catch (err) {
    res.status(500).json({ error: 'Failed to join group' });
  }
});


module.exports = router;
