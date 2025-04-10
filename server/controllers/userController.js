const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Doctor = require("../models/doctorModel");
const Appointment = require("../models/appointmentModel");
const nodemailer = require("nodemailer");
const sendGridTransport = require("nodemailer-sendgrid-transport");
require("dotenv").config();

const getuser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    return res.send(user);
  } catch (error) {
    res.status(500).send("Unable to get user");
  }
};

const getallusers = async (req, res) => {
  try {
    const { filter, search } = req.query;
    let query = {};
    if (search && search.trim() !== "") {
      const searchRegex = new RegExp(search, "i");
      if (filter === "firstname") {
        query.firstname = { $regex: searchRegex };
      } else if (filter === "lastname") {
        query.lastname = { $regex: searchRegex };
      } else if (filter === "email") {
        query.email = { $regex: searchRegex };
      } else {
        // Search across multiple fields if no specific filter
        query.$or = [
          { firstname: { $regex: searchRegex } },
          { lastname: { $regex: searchRegex } },
          { email: { $regex: searchRegex } },
        ];
      }
    }
    const users = await User.find(query).select("-password");
    return res.status(200).send(users);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Unable to get all users");
  }
};

const login = async (req, res) => {
  try {
    const emailPresent = await User.findOne({ email: req.body.email });
    if (!emailPresent) {
      return res.status(400).send("Incorrect credentials");
    }
    if(emailPresent.role != req.body.role){
      return res.status(404).send("Role does not exist");
    }
    const verifyPass = await bcrypt.compare(
      req.body.password,
      emailPresent.password
    );
    if (!verifyPass) {
      return res.status(400).send("Incorrect credentials");
    }
    const token = jwt.sign(
      { userId: emailPresent._id, role:emailPresent.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "2 days",
      }
    );
    return res.status(201).send({ msg: "User logged in successfully", token });
  } catch (error) {
    res.status(500).send("Unable to login user");
  }
};

const register = async (req, res) => {
  try {
    const emailPresent = await User.findOne({ email: req.body.email });
    if (emailPresent) {
      return res.status(400).send("Email already exists");
    }
    // if any attacker tries to enter as admin change the role of attacker to user
    // you can change this if you want to change the admin
    if(req.body.role == "Admin"){
      req.body.role = "Patient";
    }
    const hashedPass = await bcrypt.hash(req.body.password, 10);
    const user = await User({ ...req.body, password: hashedPass });
    await user.save();
    return res.status(201).send("User registered successfully");
  } catch (error) {
    res.status(500).send({ message : error.message });
  }
};

const updateprofile = async (req, res) => {
  try {
    const result = await User.findByIdAndUpdate(
      { _id: req.locals },
      { ...req.body }
    );
    if (!result) {
      return res.status(500).send("Unable to update user");
    }
    return res.status(201).send("User updated successfully");
  } catch (error) {
    res.status(500).send("Unable to update user");
  }
};

const changepassword = async (req, res) => {
  try {
    const { userId, currentPassword, newPassword, confirmNewPassword } = req.body;
    if (newPassword !== confirmNewPassword) {
      return res.status(400).send("Passwords do not match");
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordMatch) {
      return res.status(400).send("Incorrect current password");
    }
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
    user.password = hashedNewPassword;
    await user.save();
    return res.status(200).send("Password changed successfully");
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
};



const deleteuser = async (req, res) => {
  try {
    const result = await User.findByIdAndDelete(req.body.userId);
    const removeDoc = await Doctor.findOneAndDelete({
      userId: req.body.userId,
    });
    const removeAppoint = await Appointment.findOneAndDelete({
      userId: req.body.userId,
    });
    return res.send("User deleted successfully");
  } catch (error) {
    res.status(500).send("Unable to delete user");
  }
};

const forgotpassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ status: "User not found" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1m" });
    const transporter = nodemailer.createTransport(
      sendGridTransport({
        service:'gmail',
        auth: {
          api_key: process.env.SENDGRID_API_KEY,
        },
      })
    );
    const mailOptions = {
      from: "bashira.farhin.ug21@nsut.ac.in",
      to: email,
      subject: "Reset Password Link",
      text: `${process.env.CLIENT_URL}/resetpassword/${user._id}/${token}`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).send({ status: "Error sending email" });
      } else {
        return res.status(200).send({ status: "Email sent successfully" });
      }
    });
  } catch (error) {
    return res.status(500).send({ status: "Internal Server Error" });
  }
};

const resetpassword = async (req, res) => {
  try {
    const { id, token } = req.params;
    const { password } = req.body;
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(400).send({ error: "Invalid or expired token" });
      }
     
      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.findByIdAndUpdate(id, { password: hashedPassword });
        return res.status(200).send({ success: "Password reset successfully" });
      } catch (updateError) {
        return res.status(500).send({ error: "Failed to update password" });
      }
    });
  } catch (error) {
    return res.status(500).send({ error: "Internal Server Error" });
  }
};


module.exports = {
  getuser,
  getallusers,
  login,
  register,
  updateprofile,
  deleteuser,
  changepassword,
  forgotpassword,
  resetpassword,
};
