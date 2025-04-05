const Doctor = require("../models/doctorModel");
const User = require("../models/userModel");
const Notification = require("../models/notificationModel");
const Appointment = require("../models/appointmentModel");

const getalldoctors = async (req, res) => {
  try {
    const { filter = "all", search = "" } = req.query;
    const query = { isDoctor: true };
    const doctors = await Doctor.find(query).populate("userId");

    const searchLower = search.trim().toLowerCase();

    // If there's no search term, return all doctors
    if (!searchLower) {
      return res.send(doctors);
    }

    const filteredDoctors = doctors.filter((doc) => {
      const { userId, specialization } = doc;

      if (!userId) return false;

      if (filter === "firstname") {
        return userId.firstname?.toLowerCase().includes(searchLower);
      }

      if (filter === "specialization") {
        return specialization?.toLowerCase().includes(searchLower);
      }

      // If filter is 'all', search across multiple fields
      return (
        userId.firstname?.toLowerCase().includes(searchLower) ||
        userId.lastname?.toLowerCase().includes(searchLower) ||
        userId.email?.toLowerCase().includes(searchLower) ||
        specialization?.toLowerCase().includes(searchLower)
      );
    });

    return res.send(filteredDoctors);
  } catch (error) {
    return res.status(500).send("Unable to get doctors");
  }
};


const getnotdoctors = async (req, res) => {
  try {
    const docs = await Doctor.find({ isDoctor: false })
      .find({
        _id: { $ne: req.locals },
      })
      .populate("userId");
    return res.send(docs);
  } catch (error) {
    res.status(500).send("Unable to get non doctors");
  }
};

const applyfordoctor = async (req, res) => {
  try {
    const alreadyFound = await Doctor.findOne({ userId: req.locals });
    if (alreadyFound) {
      return res.status(400).send("Application already exists");
    }
    const doctor = Doctor({ ...req.body.formDetails, userId: req.locals });
    const result = await doctor.save();
    return res.status(201).send("Application submitted successfully");
  } catch (error) {
    res.status(500).send("Unable to submit application");
  }
};

const acceptdoctor = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.body.id },
      { isDoctor: true, status: "accepted" }
    );
    const doctor = await Doctor.findOneAndUpdate(
      { userId: req.body.id },
      { isDoctor: true }
    );
    const notification = await Notification({
      userId: req.body.id,
      content: `Congratulations, Your application has been accepted.`,
    });
    await notification.save();
    return res.status(201).send("Application accepted notification sent");
  } catch (error) {
    res.status(500).send("Error while sending notification");
  }
};

const rejectdoctor = async (req, res) => {
  try {
    const details = await User.findOneAndUpdate(
      { _id: req.body.id },
      { isDoctor: false, status: "rejected" }
    );
    const delDoc = await Doctor.findOneAndDelete({ userId: req.body.id });
    const notification = await Notification({
      userId: req.body.id,
      content: `Sorry, Your application has been rejected.`,
    });
    await notification.save();
    return res.status(201).send("Application rejection notification sent");
  } catch (error) {
    res.status(500).send("Error while rejecting application");
  }
};

const deletedoctor = async (req, res) => {
  try {
    const result = await User.findByIdAndUpdate(req.body.userId, {
      isDoctor: false,
    });
    const removeDoc = await Doctor.findOneAndDelete({
      userId: req.body.userId,
    });
    const removeAppoint = await Appointment.findOneAndDelete({
      userId: req.body.userId,
    });
    return res.send("Doctor deleted successfully");
  } catch (error) {
    res.status(500).send("Unable to delete doctor");
  }
};

module.exports = {
  getalldoctors,
  getnotdoctors,
  deletedoctor,
  applyfordoctor,
  acceptdoctor,
  rejectdoctor,
};
