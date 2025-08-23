import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setGlobalState, truncate, useGlobalState } from "../store";
import {
  FaTimes,
  FaPlus,
  FaCoins,
  FaBriefcase,
  FaTags,
  FaFileAlt,
  FaLock,
} from "react-icons/fa";
import { addJobListing } from "../services/blockchain";
import { toast } from "react-toastify";

const CreateJob = () => {
  const navigate = useNavigate();
  const [createModal] = useGlobalState("createModal");
  const [jobTitle, setJobTitle] = useState("This is Test project No");
  const [minBudget, setMinBudget] = useState("50");
  const [maxBudget, setMaxBudget] = useState("100");
  const [description, setDescription] = useState(
    "Build the test project for stress testing"
  );
  const [skill, setSkill] = useState("");
  const [skills, setSkills] = useState([
    "MongoDB",
    "React",
    "Nodejs",
    "Javascript",
  ]);
  const [loading, setLoading] = useState(false);

  const addSkills = () => {
    if (!skill.trim()) return;

    if (skills.length !== 5) {
      setSkills((prevState) => [...prevState, skill]);
    }
    setSkill("");
  };

  // Allow adding skill with Enter key
  const handleSkillKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkills();
    }
  };

  const removeSkill = (index) => {
    skills.splice(index, 1);
    setSkills(() => [...skills]);
  };

  const closeModal = () => {
    setGlobalState("createModal", "scale-0");
    setJobTitle("");
    setMinBudget("");
    setMaxBudget("");
    setSkills([]);
    setSkill("");
    setDescription("");
  };

  const [formErrors, setFormErrors] = useState({
    jobTitle: false,
    minBudget: false,
    maxBudget: false,
    skills: false,
    description: false,
  });

  // Validate form fields
  const validateForm = () => {
    const errors = {
      jobTitle: jobTitle.trim() === "",
      minBudget: minBudget === "" || parseFloat(minBudget) < 0,
      maxBudget: maxBudget === "" || parseFloat(maxBudget) < 0,
      skills: skills.length < 3,
      description: description.trim() === "",
    };

    setFormErrors(errors);
    return !Object.values(errors).some((error) => error === true);
  };

  // Budget validation handlers
  const handleMinBudgetBlur = () => {
    if (minBudget && parseFloat(minBudget) < 10) {
      setFormErrors((prev) => ({ ...prev, minBudget: true }));
      toast.warning("Minimum budget must be at least 10");
    } else {
      setFormErrors((prev) => ({ ...prev, minBudget: false }));
    }

    // Also check max budget relation if both values exist
    if (
      minBudget &&
      maxBudget &&
      parseFloat(minBudget) > parseFloat(maxBudget)
    ) {
      setFormErrors((prev) => ({ ...prev, maxBudget: true }));
      toast.warning("Maximum budget cannot be less than minimum budget");
    }
  };

  const handleMaxBudgetBlur = () => {
    if (
      minBudget &&
      maxBudget &&
      parseFloat(minBudget) > parseFloat(maxBudget)
    ) {
      setFormErrors((prev) => ({ ...prev, maxBudget: true }));
      toast.warning("Maximum budget cannot be less than minimum budget");
    } else {
      setFormErrors((prev) => ({ ...prev, maxBudget: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please correct the highlighted fields");
      return;
    }

    setLoading(true);

    const params = {
      jobTitle,
      description,
      tags: skills.slice(0, 5).join(","),
      minBudget,
      maxBudget,
    };

    await toast.promise(
      new Promise(async (resolve, reject) => {
        await addJobListing(params)
          .then(async (tx) => {
            closeModal();
            setGlobalState("dataUpdate", (prev) => prev + 1);
            navigate("/myprojects");
            resolve(tx);
          })
          .catch((error) => {
            console.error(error);
            reject(error);
          })
          .finally(() => {
            setLoading(false);
          });
      }),
      {
        pending: "Processing transaction...",
        success: "Job posted successfully! 🎉",
        error: "Transaction failed. Please try again 🔄",
      }
    );
  };

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex items-center justify-center
      bg-black/50 backdrop-blur-sm transform z-50 transition-all duration-300 ${createModal}`}
      onClick={(e) => e.target === e.currentTarget && closeModal()}
      aria-modal="true"
      role="dialog"
      aria-labelledby="create-job-title"
    >
      <div
        className="bg-white/95 backdrop-blur-xl shadow-elevated rounded-2xl w-11/12 md:w-3/5 lg:w-2/5 max-h-[90vh] overflow-y-auto p-0 transform transition-all duration-500"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with gradient border */}
        <div className="relative border-b border-gray-100 bg-gradient-to-r from-primary-50 to-secondary-50 p-6 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-white shadow-md">
              <FaBriefcase />
            </div>
            <div>
              <h3
                id="create-job-title"
                className="font-display text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 text-transparent bg-clip-text"
              >
                Create a New Job
              </h3>
              <p className="text-gray-500 text-sm">
                Fill in the details to post your job
              </p>
            </div>
          </div>

          <button
            onClick={closeModal}
            className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-200 text-gray-500 hover:text-red-500"
            aria-label="Close modal"
          >
            <FaTimes />
          </button>
        </div>

        <div className="p-6">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Form sections with icons */}
            <div className="flex items-center gap-2 mb-5 text-primary-600 border-b border-gray-100 pb-2">
              <FaBriefcase />
              <h4 className="text-lg font-semibold">Job Details</h4>
            </div>

            {/* Job Title */}

            <div className="form-group">
              <label
                htmlFor="jt"
                className="form-label flex items-center justify-between"
              >
                <span>
                  Job Title <span className="text-red-500">*</span>
                </span>
                {formErrors.jobTitle && (
                  <span className="text-xs text-red-500">Required field</span>
                )}
              </label>
              <div className="relative">
                <input
                  id="jt"
                  value={jobTitle}
                  placeholder="Describe the job title briefly"
                  type="text"
                  className={`form-input pl-10 py-3 resize-none w-full border-2 rounded-lg ${
                    formErrors.jobTitle
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200"
                  }`}
                  style={{ minHeight: "50px" }}
                  onChange={(e) => {
                    setJobTitle(e.target.value);
                    if (e.target.value) {
                      setFormErrors((prev) => ({ ...prev, jobTitle: false }));
                    }
                  }}
                  required
                  aria-invalid={formErrors.jobTitle}
                  aria-describedby={
                    formErrors.jobTitle ? "job-title-error" : undefined
                  }
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <FaBriefcase
                    className={
                      formErrors.jobTitle ? "text-red-400" : "text-primary-500"
                    }
                  />
                </span>
              </div>
              {formErrors.jobTitle && (
                <p id="job-title-error" className="sr-only">
                  Job title is required
                </p>
              )}
            </div>

            {/* Budget Section Header */}
            <div className="flex items-center gap-2 mt-6 mb-5 text-primary-600 border-b border-gray-100 pb-2">
              <FaCoins />
              <h4 className="text-lg font-semibold">Budget Information</h4>
            </div>

            {/* Budget Fields - 2 column layout on larger screens */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label
                  htmlFor="minBudget"
                  className="form-label flex items-center justify-between"
                >
                  <span>
                    Minimum Budget (USDT){" "}
                    <span className="text-red-500">*</span>
                  </span>
                  {formErrors.minBudget && (
                    <span className="text-xs text-red-500">Required</span>
                  )}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FaCoins
                      className={
                        formErrors.minBudget
                          ? "text-red-400"
                          : "text-primary-500"
                      }
                    />
                  </span>
                  <input
                    id="minBudget"
                    value={minBudget}
                    placeholder="e.g. 10"
                    type="number"
                    step="0.01"
                    min="0"
                    className={`form-input pl-10 ${
                      formErrors.minBudget ? "border-red-300 bg-red-50" : ""
                    }`}
                    onChange={(e) => {
                      setMinBudget(e.target.value);
                    }}
                    onBlur={handleMinBudgetBlur}
                    required
                    aria-invalid={formErrors.minBudget}
                  />
                </div>
              </div>

              <div className="form-group">
                <label
                  htmlFor="maxBudget"
                  className="form-label flex items-center justify-between"
                >
                  <span>
                    Maximum Budget (USDT){" "}
                    <span className="text-red-500">*</span>
                  </span>
                  {formErrors.maxBudget && (
                    <span className="text-xs text-red-500">Invalid</span>
                  )}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FaCoins
                      className={
                        formErrors.maxBudget
                          ? "text-red-400"
                          : "text-primary-500"
                      }
                    />
                  </span>
                  <input
                    id="maxBudget"
                    value={maxBudget}
                    placeholder="e.g. 100"
                    type="number"
                    step="0.01"
                    min="0"
                    className={`form-input pl-10 ${
                      formErrors.maxBudget ? "border-red-300 bg-red-50" : ""
                    }`}
                    onChange={(e) => {
                      setMaxBudget(e.target.value);
                    }}
                    onBlur={handleMaxBudgetBlur}
                    required
                    aria-invalid={formErrors.maxBudget}
                  />
                </div>
              </div>
            </div>

            {/* Skills Section Header */}
            <div className="flex items-center gap-2 mt-6 mb-5 text-primary-600 border-b border-gray-100 pb-2">
              <FaTags />
              <h4 className="text-lg font-semibold">Required Skills</h4>
            </div>

            {/* Skills */}
            <div className="form-group">
              <label
                htmlFor="skills"
                className="form-label flex items-center justify-between"
              >
                <span>
                  Skills <span className="text-red-500">*</span>
                  <span className="text-xs text-gray-500 ml-2">
                    (3-5 skills required)
                  </span>
                </span>
                {formErrors.skills && (
                  <span className="text-xs text-red-500">
                    Add at least 3 skills
                  </span>
                )}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <FaTags
                    className={
                      formErrors.skills ? "text-red-400" : "text-primary-500"
                    }
                  />
                </span>
                <input
                  id="skills"
                  type="text"
                  value={skill}
                  className={`form-input pl-10 pr-12 ${
                    formErrors.skills ? "border-red-300" : ""
                  }`}
                  placeholder="e.g. React, TypeScript, JavaScript, Node.js, Express"
                  onChange={(e) => setSkill(e.target.value)}
                  onKeyPress={handleSkillKeyPress}
                  disabled={skills.length >= 5}
                  aria-invalid={formErrors.skills}
                />
                {skills.length < 5 ? (
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white rounded-md p-1.5 transition-colors duration-200 shadow-sm"
                    onClick={addSkills}
                    disabled={!skill.trim()}
                    aria-label="Add skill"
                  >
                    <FaPlus className="text-xs" />
                  </button>
                ) : null}
              </div>

              {/* Skills tags */}
              <div className="flex items-center flex-wrap gap-2 mt-3 min-h-[40px] bg-gray-50/80 p-3 rounded-md">
                {skills.length === 0 ? (
                  <span className="text-sm text-gray-400 italic">
                    Skills will appear here
                  </span>
                ) : (
                  skills.map((skill, i) => (
                    <div
                      key={i}
                      className="badge-secondary flex items-center gap-2 group hover:scale-105 transition-transform duration-200 animate-fade-in"
                    >
                      <span>{skill}</span>
                      <button
                        onClick={() => removeSkill(i)}
                        type="button"
                        className="text-secondary-400 hover:text-red-500 transition-colors duration-200"
                        aria-label={`Remove skill ${skill}`}
                      >
                        <FaTimes size={12} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="flex justify-between mt-2">
                {skills.length < 3 && (
                  <p className="text-xs text-amber-600">
                    Add at least {3 - skills.length} more skill
                    {skills.length < 2 ? "s" : ""}
                  </p>
                )}
                <p className="text-xs text-gray-500 ml-auto">
                  {skills.length}/5 skills added
                </p>
              </div>
            </div>

            {/* Description Section Header */}
            <div className="flex items-center gap-2 mt-6 mb-5 text-primary-600 border-b border-gray-100 pb-2">
              <FaFileAlt />
              <h4 className="text-lg font-semibold">Job Description</h4>
            </div>

            {/* Description */}
            <div className="form-group">
              <label
                htmlFor="desc"
                className="form-label flex items-center justify-between"
              >
                <span>
                  Description <span className="text-red-500">*</span>
                </span>
                {formErrors.description && (
                  <span className="text-xs text-red-500">Required field</span>
                )}
              </label>
              <textarea
                id="desc"
                value={description}
                rows="5"
                placeholder="Describe the job requirements, deliverables, timeline, etc."
                className={`form-textarea ${
                  formErrors.description ? "border-red-300 bg-red-50" : ""
                }`}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (e.target.value) {
                    setFormErrors((prev) => ({ ...prev, description: false }));
                  }
                }}
                required
                aria-invalid={formErrors.description}
              ></textarea>
              <p className="text-xs text-gray-500 mt-1">
                Detailed description helps attract the right freelancers
              </p>
            </div>

            {/* Legal section with terms */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start gap-2">
                <div className="mt-1">
                  <FaLock className="text-primary-500" />
                </div>
                <div>
                  <h5 className="text-sm font-medium text-gray-700">
                    Security & Terms
                  </h5>
                  <p className="text-xs text-gray-600 mt-1">
                    By posting this job, you agree to our terms of service and
                    confirm that the funds for this job will be held in escrow
                    until work is completed and approved.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-100 mt-6 flex justify-end">
              <button
                type="submit"
                className="btn-gradient px-8 py-3 flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg active:scale-95"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing Transaction...
                  </>
                ) : (
                  "Post Job"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateJob;
