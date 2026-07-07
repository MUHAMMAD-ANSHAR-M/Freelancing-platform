const User = require("../models/User");

// GET /api/users  (list/browse freelancers, supports ?role=freelancer&skill=React)
async function getUsers(req, res, next) {
  try {
    const { role, skill } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (skill) filter.skills = { $in: [skill] };

    const users = await User.find(filter).select("-password");
    res.json(users);
  } catch (err) {
    next(err);
  }
}

// GET /api/users/:id
async function getUserById(req, res, next) {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json(user);
  } catch (err) {
    next(err);
  }
}

// PUT /api/users/:id  (owner only)
async function updateUser(req, res, next) {
  try {
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: "You can only update your own profile." });
    }

    const allowedFields = ["name", "title", "bio", "skills", "hourlyRate", "portfolio", "avatarUrl"];
    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    }).select("-password");

    res.json(user);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/users/:id  (owner only — soft delete)
async function deleteUser(req, res, next) {
  try {
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: "You can only delete your own account." });
    }
    await User.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: "Account deactivated." });
  } catch (err) {
    next(err);
  }
}

module.exports = { getUsers, getUserById, updateUser, deleteUser };
