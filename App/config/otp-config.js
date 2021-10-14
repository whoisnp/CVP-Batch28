const sgMail = require("@sendgrid/mail");

const { SENDGRID_API_KEY } = require("./keys");

function getOTP() {
  const max = 100000;

  return Math.floor(Math.random() * Math.floor(max)) + max;
}

function sendOTP(email, otp) {
  sgMail.setApiKey(SENDGRID_API_KEY);

  const msg = {
    to: email,
    from: "nithyap322@gmail.com",
    subject: "My Bands - Reset Password OTP",
    html: `Your OTP for password reset is : <strong>${otp}</strong>`,
  };

  sgMail.send(msg).catch((err) => console.log(err));
}

module.exports = {
  SENDGRID_API_KEY,
  sendOTP,
  getOTP,
};
