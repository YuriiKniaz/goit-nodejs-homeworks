const sgMail = require("@sendgrid/mail");
require("dotenv").config();

const { SENDGRID_API } = process.env;

sgMail.setApiKey(SENDGRID_API);

const sendEmail = async (data) => {
  const email = { ...data, from: "yuri.kniaz@gmail.com" };

  await sgMail.send(email);

  return true;
};

module.exports = sendEmail;
