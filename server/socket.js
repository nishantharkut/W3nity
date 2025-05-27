const Group = require('./models/Group.js');
const Message = require('./models/Message.js');

module.exports = (io) => {
  const activeUsersByGroup = {};

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join Group
    socket.on('joinGroup', async ({ groupId, user }) => {
      if (!user || !user._id || !user.username ||!user.email || !groupId) {
        console.error('Invalid joinGroup data:', { groupId, user });
        return;
      }

      socket.join(groupId);

      try {
        // Send past messages from Message collection
        const messages = await Message.find({ groupId }).sort({ timestamp: 1 });
        socket.emit('groupMessages', messages);
      } catch (err) {
        console.error('Error fetching messages for group:', err);
      }

      // Track active users in the group
      if (!activeUsersByGroup[groupId]) {
        activeUsersByGroup[groupId] = [];
      }

      const alreadyActive = activeUsersByGroup[groupId].some(
        (u) => u.userId === user._id
      );

      if (!alreadyActive) {
        activeUsersByGroup[groupId].push({
          socketId: socket.id,
          userId: user._id,
          username: user.username,
          email: user.email,
        });
      }

      // Broadcast updated active user list to the group
      io.to(groupId).emit(
        'activeUsers',
        activeUsersByGroup[groupId].map(({ userId, username , email}) => ({
          _id: userId,
          username,
          email
        }))
      );
    });

    // Send Message
    socket.on('sendMessage', async ({ groupId, sender, text }) => {
      if (!groupId || !sender || !sender._id || !sender.username || !text?.trim()) {
        console.error('Invalid sendMessage data:', { groupId, sender, text });
        return;
      }

      try {
        const group = await Group.findById(groupId);
        if (!group) {
          console.warn(`Group not found: ${groupId}`);
          return;
        }

        // Create and store the message in the Message collection
        const message = await Message.create({
          groupId,
          sender: {
            _id: sender._id,
            username: sender.username,
          },
          text: text.trim(),
        });

        // Update group's last activity
        group.lastActivity = new Date();
        await group.save();

        // Emit the new message to all group members
        io.to(groupId).emit('newMessage', { groupId, message });
      } catch (err) {
        console.error('Error sending message:', err);
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);

      for (const groupId in activeUsersByGroup) {
        const beforeCount = activeUsersByGroup[groupId].length;
        activeUsersByGroup[groupId] = activeUsersByGroup[groupId].filter(
          (u) => u.socketId !== socket.id
        );
        const afterCount = activeUsersByGroup[groupId].length;

        if (beforeCount !== afterCount) {
          io.to(groupId).emit(
            'activeUsers',
            activeUsersByGroup[groupId].map(({ userId, username }) => ({
              _id: userId,
              username,
            }))
          );
        }
      }
    });
  });
};
