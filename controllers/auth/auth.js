const User = require("../../model/user");
const { sendToken } = require("../../helpers/auth/tokenHelper");
const { comparePassword } = require("../../helpers/inputHelper");

const getPrivateData = async (req, res, next) => {
  try {
    return await res.status(200).json({
      success: true,
      message: "You got access to the private data in this route ",
      user: req.user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error ", error: `${error}` });
  }
};

const register = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    if (!email || !password) {
      throw Error("please fill all field");
    }
    

    const user = await User.findOne({ email });
    if (user) {
      throw Error("This email is already registered");
    }

    if (password.length < 4) {
      throw Error("make sure password lenght is not less than 4");
    }
    const newUser = await new User({
      username,
      email,
      password,
    });

    await newUser.save();

    sendToken(newUser, 201, res, "registered successfully");
  } catch (err) {
    console.log(`server error in register //${err}//`);
    res.status(500).json({ message: "Server error ", error: `${err}` });
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      throw Error("please fill all field");
    }

   

    const user = await User.findOne({ email }).select("+password");

    if (password.length < 4) {
      throw Error("make sure password lenght is not less than 4");
    }
    if (!user) {
      throw Error("No user found");
    } else if (!comparePassword(password, user.password)) {
      throw Error("User password doesn't match");
    }

    return sendToken(user, 201, res, "logged in successfully");
  } catch (err) {
    console.log(`error in login ${err}`);
    res.status(500).json({ message: "Server error", error: `${err}` });
  }
};

const forgetPassword = async (req, res, next) => {
  const { URI_CLIENT, EMAIL_USERNAME } = process.env;

  const resetEmail = req.body.email;
  console.log(resetEmail);

  try {
    if (!resetEmail) {
      throw Error("Please give an email");
    }
    const user = await User.findOne({ email: resetEmail }).exec();

    if (!user) {
      throw Error("No user found with this email");
    }

    const resetPasswordToken = await user.getResetPasswordFromUser();

    await user.save();

    const requestPasswordURI =
      `${URI_CLIENT}resetpassword?resetPasswordToken=${resetPasswordToken}`;

    const emailTemplate ={ 
      from:process.env.MAIL_USERNAME,
      to:resetEmail,
      subject:"Test",
      html:`
  <h3 style="color: red" > Reset your password </h3>
  <p>This <a href=${requestPasswordURI} target="_blank">link </a>will expire in 1 hours</P>
`} 
    await sendMail(emailTemplate);

    return res.status(200).json({
      success: true,
      message: "Email send",
    });
  } catch (error) {
    console.log(error)
    console.log(`Server Error = ${error}`);
    res.status(500).json({
      message: "Server error",
      error: `${error}`,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const newPassword = req.body.password;
    console.log(`new password in resetpassword newPassword=${newPassword}`);
    const { resetPasswordToken } = req.query;

    console.log(`in resetpassword  resetpassword=${resetPasswordToken}`);

    if (!resetPasswordToken) {
      throw Error("There is no token for reset the password");
    }

    const user = await User.findOne({
      resetPasswordToken: resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      throw Error("May be token is expired");
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPassWordExpire = undefined;

    await user.save();
    console.log(user);
    return res.status(201).json({
      success: true,
      message: "Reset password is successfull",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error", error: `${err}` });
  }
};

module.exports = {
  register,
  login,
  forgetPassword,
  resetPassword,
  getPrivateData,
};
