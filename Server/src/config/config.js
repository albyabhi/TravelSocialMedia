const generateToken = (user) => {
  const payload = {
    userId: user._id,
    username: user.username,
    email: user.email,
  };


  // Specify an expiration time if needed
  const expiresIn = '1h';

  // Generate the JWT token
  const token = jwt.sign(payload, secretKey, { expiresIn });

  return token;
};

module.exports = {
  generateToken,
  mongoURI: 'mongodb+srv://Albyabhi:Albyabhi4645@cluster0.prdylvt.mongodb.net/TSM?retryWrites=true&w=majority',
  port: process.env.PORT || 5000,
  secretKey : 'g^b25s9#L!aD2sF7cP4%kR1@uA8',
};
