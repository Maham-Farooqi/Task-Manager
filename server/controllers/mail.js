const nodemailer = require("nodemailer");
const cron = require("node-cron");
const Task = require("../models/taskModel");
const dotenv = require('dotenv')
const temp=require('./mailtemp')

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
});

cron.schedule('58 16 * * *', async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const tasksDueToday = await Task.find({
      dueDate: { $gte: today, $lt: tomorrow },
    }).populate("userid");

    tasksDueToday.forEach((task) => {
      if (!task.userid?.email) return;

      const mailOptions = {
        from: process.env.USER,
        to: task.userid.email,
        subject: "🔔 Task Due Today!",
        text: `Reminder, Please make sure to complete it.`,
        html:temp.replace("{Name}",task.name)

      };

      transporter.sendMail(mailOptions, (err) => {
        if (err) console.error("Error sending email:", err);
        else console.log("Email sent to", task.userid.email);
      });
    });
  } catch (error) {
    console.error("Cron job error:", error);
  }
});
