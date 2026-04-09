const Notification = require("../models/Notification");

const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({
      createdAt: -1
    });

    res.json({
      success: true,
      notifications
    });
  } catch (error) {
    next(error);
  }
};

const markNotificationAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id
      },
      { read: true },
      { new: true }
    );

    if (!notification) {
      const error = new Error("Notification not found");
      error.statusCode = 404;
      throw error;
    }

    res.json({
      success: true,
      notification
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getNotifications, markNotificationAsRead };
