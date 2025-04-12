const mongoose = require("mongoose");

const SchoolBranchSchema = new mongoose.Schema(
  {
    branch: { type: String, required: true },
  }
);

const SchoolClassesSchema = new mongoose.Schema(
  {
    classes: {
      key: { type: String, required: true },
      label: { type: String, required: true }
    },
  }
);

const SchoolSubjectsSchema = new mongoose.Schema(
  {
    subjects: {
      key: { type: String, required: true },
      label: { type: String, required: true }
    },
  }
);

const SchoolBranch = mongoose.model("branch", SchoolBranchSchema);
const SchoolClasses = mongoose.model("class", SchoolClassesSchema);
const SchoolSubjects = mongoose.model("subject", SchoolSubjectsSchema);

module.exports ={ SchoolBranch, SchoolClasses, SchoolSubjects };
