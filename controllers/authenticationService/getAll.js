const User = require("../../models/user");

async function getAll() {
  try {
    const users = await User.find({ name: "isd9teg" });
    return users.map((x) => basicDetails(x));
  } catch (error) {}
}

function basicDetails(user) {
  const { id, name, email } = user;
  return { id, name, email };
}
module.exports = getAll;
