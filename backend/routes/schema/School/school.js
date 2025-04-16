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

const SchoolSubjectClassTeacherSchema = new mongoose.Schema(
  {
    class: { type: String, unique: true },
    details: {
      teacher: { type: String, required: true },
      subject: { type: String, required: true }
    },
  }
);

const SchoolBranch = mongoose.model("branch", SchoolBranchSchema);
const SchoolClasses = mongoose.model("class", SchoolClassesSchema);
const SchoolSubjects = mongoose.model("subject", SchoolSubjectsSchema);
const SchoolSubjectClassTeacher = mongoose.model("subjectclassteacher", SchoolSubjectClassTeacherSchema);

module.exports ={ SchoolBranch, SchoolClasses, SchoolSubjects, SchoolSubjectClassTeacher };
