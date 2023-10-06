const User = require("../model/userModel");
const bcrypt = require("bcrypt");
module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Perform validation here (e.g., check if required fields are provided)
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists." });
    }
    // Check if the user with the same email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res
        .status(400)
        .json({ message: "User with this email already exists." });
    }
    const hasedPassword = await bcrypt.hash(password, 10);
    // Create a new user in the database
    const newUser = new User({
      username,
      email,
      password: hasedPassword, // You should hash the password before saving it to the database
    });
    delete newUser.password;

    await newUser.save();

    // Respond with a success message or token, depending on your authentication system
    return res
      .status(201)
      .json({ message: "User registered successfully.", newUser });
  } catch (error) {
    // Handle any errors that occur during registration
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};