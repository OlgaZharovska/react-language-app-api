const User = require("../../models/user");

async function getById(id) {
  try {
    const user = await User.findById(id);
    return basicDetails(user);
  } catch (error) {
    return "User not found";
  }
}

function basicDetails(user) {
  const { id, name, email } = user;
  return { id, name, email };
}
module.exports = getById;
