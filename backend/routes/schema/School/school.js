const mongoose = require("mongoose");

const SchoolBranchSchema = new mongoose.Schema(
  {
    branch: { type: String, required: true },
  }
);

const SchoolBranch = mongoose.model("branch", SchoolBranchSchema);

module.exports = SchoolBranch;
