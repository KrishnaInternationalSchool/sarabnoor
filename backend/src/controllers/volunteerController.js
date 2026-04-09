const VolunteerApplication = require("../models/VolunteerApplication");
const Notification = require("../models/Notification");
const { validate } = require("../utils/validate");
const {
  volunteerSchema,
  volunteerReviewSchema
} = require("../validators/volunteerValidators");

const createVolunteerApplication = async (req, res, next) => {
  try {
    const payload = validate(volunteerSchema, req.body);
    const existing = await VolunteerApplication.findOne({ user: req.user._id });

    if (existing) {
      const error = new Error("Volunteer application already exists for this account");
      error.statusCode = 409;
      throw error;
    }

    const profilePhoto = req.files?.profilePhoto?.[0];
    const documents = req.files?.documents || [];

    if (!profilePhoto || documents.length === 0) {
      const error = new Error("Profile photo and at least one identity document are required");
      error.statusCode = 400;
      throw error;
    }

    const application = await VolunteerApplication.create({
      user: req.user._id,
      interestArea: payload.interestArea,
      message: payload.message,
      profilePhoto: `/api/uploads/${profilePhoto.filename}`,
      documents: documents.map((file) => ({
        label: file.originalname,
        fileUrl: `/api/uploads/${file.filename}`
      }))
    });

    await Notification.create({
      user: req.user._id,
      title: "Volunteer application submitted",
      message: "Your application is under review. We will notify you once it has been processed."
    });

    res.status(201).json({ success: true, application });
  } catch (error) {
    next(error);
  }
};

const getMyVolunteerApplication = async (req, res, next) => {
  try {
    const application = await VolunteerApplication.findOne({ user: req.user._id }).populate(
      "user",
      "name email phone"
    );

    res.json({
      success: true,
      application
    });
  } catch (error) {
    next(error);
  }
};

const getAllVolunteerApplications = async (req, res, next) => {
  try {
    const applications = await VolunteerApplication.find()
      .populate("user", "name email phone")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      applications
    });
  } catch (error) {
    next(error);
  }
};

const reviewVolunteerApplication = async (req, res, next) => {
  try {
    const payload = validate(volunteerReviewSchema, req.body);
    const application = await VolunteerApplication.findById(req.params.id).populate("user");

    if (!application) {
      const error = new Error("Volunteer application not found");
      error.statusCode = 404;
      throw error;
    }

    application.status = payload.status;
    application.remarks = payload.remarks;
    application.rejectionReason = payload.rejectionReason;
    application.verifiedVolunteer = payload.status === "verified" && payload.verifiedVolunteer;
    await application.save();

    await Notification.create({
      user: application.user._id,
      title:
        payload.status === "verified"
          ? "Volunteer application approved"
          : "Volunteer application update",
      message:
        payload.status === "verified"
          ? "Your volunteer application has been verified."
          : `Your volunteer application was rejected. Reason: ${payload.rejectionReason}`
    });

    res.json({
      success: true,
      application
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createVolunteerApplication,
  getMyVolunteerApplication,
  getAllVolunteerApplications,
  reviewVolunteerApplication
};
