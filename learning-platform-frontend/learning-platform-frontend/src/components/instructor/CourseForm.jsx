import { useState, useEffect } from "react";
import { Save, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import courseService from "../../services/courseService";

const initialValues = {
  title: "",
  description: "",
  category: "",
  level: "BEGINNER",
  thumbnailUrl: "",
};

function CourseForm({
  initialData = initialValues,
  onSubmit,
  isSubmitting = false,
  submitLabel = "Create Course",
}) {
  const [formData, setFormData] = useState({
    ...initialValues,
    ...initialData,
    thumbnailUrl: initialData.thumbnailUrl || "",
  });

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoryError, setCategoryError] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        setCategoryError("");

        const data = await courseService.getAvailableCategories();
        setCategories(data);
      } catch (error) {
        setCategoryError(
          error.response?.data?.message ||
            "Unable to load course categories."
        );
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  }

  function validate() {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Course title is required.";
    } else if (formData.title.trim().length > 150) {
      newErrors.title = "Title cannot exceed 150 characters.";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required.";
    } else if (formData.description.trim().length > 5000) {
      newErrors.description =
        "Description cannot exceed 5000 characters.";
    }

    if (!formData.category.trim()) {
      newErrors.category = "Category is required.";
    }

    if (
      formData.thumbnailUrl.trim() &&
      !/^https?:\/\/\S+$/i.test(formData.thumbnailUrl.trim())
    ) {
      newErrors.thumbnailUrl = "Enter a valid HTTP or HTTPS URL.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!validate()) return;

    onSubmit({
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category.trim(),
      level: formData.level,
      thumbnailUrl: formData.thumbnailUrl.trim(),
    });
  }

  const inputClass =
    "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-50";

  const existingCategoryUnavailable =
    formData.category &&
    !categories.some((category) => category.name === formData.category);

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7"
    >
      {/* Course Title */}
      <div>
        <label
          htmlFor="title"
          className="text-sm font-semibold text-slate-800"
        >
          Course Title <span className="text-red-500">*</span>
        </label>

        <input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          maxLength={150}
          placeholder="Example: Complete Java and Spring Boot"
          className={inputClass}
          aria-invalid={Boolean(errors.title)}
        />

        {errors.title && (
          <p className="mt-1.5 text-sm text-red-600">{errors.title}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="text-sm font-semibold text-slate-800"
        >
          Course Description <span className="text-red-500">*</span>
        </label>

        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          maxLength={5000}
          rows={5}
          placeholder="Explain what learners will learn in this course..."
          className={`${inputClass} resize-y`}
          aria-invalid={Boolean(errors.description)}
        />

        <p className="mt-1 text-right text-xs text-slate-400">
          {formData.description.length}/5000
        </p>

        {errors.description && (
          <p className="text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      {/* Category and Level */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="category"
            className="text-sm font-semibold text-slate-800"
          >
            Course Category <span className="text-red-500">*</span>
          </label>

          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            disabled={
              categoriesLoading ||
              (categories.length === 0 && !formData.category)
            }
            className={inputClass}
          >
            <option value="">
              {categoriesLoading ? "Loading categories..." : "Select a category"}
            </option>

            {existingCategoryUnavailable && (
              <option value={formData.category}>
                {formData.category} (Existing category)
              </option>
            )}

            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>

          {errors.category && (
            <p className="mt-1.5 text-sm text-red-600">
              {errors.category}
            </p>
          )}

          {categoryError && (
            <p className="mt-2 text-sm text-red-600">{categoryError}</p>
          )}

          {!categoriesLoading &&
            !categoryError &&
            categories.length === 0 && (
              <p className="mt-2 text-sm text-slate-500">
                No categories are available. Please contact the administrator.
              </p>
            )}
        </div>

        <div>
          <label
            htmlFor="level"
            className="text-sm font-semibold text-slate-800"
          >
            Difficulty Level <span className="text-red-500">*</span>
          </label>

          <select
            id="level"
            name="level"
            value={formData.level}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
          </select>
        </div>
      </div>

      {/* Thumbnail URL */}
      <div>
        <label
          htmlFor="thumbnailUrl"
          className="text-sm font-semibold text-slate-800"
        >
          Thumbnail URL
        </label>

        <input
          id="thumbnailUrl"
          name="thumbnailUrl"
          value={formData.thumbnailUrl}
          onChange={handleChange}
          placeholder="https://example.com/thumbnail.jpg"
          className={inputClass}
          aria-invalid={Boolean(errors.thumbnailUrl)}
        />

        <p className="mt-1.5 text-xs text-slate-500">
          Optional. Provide an image URL for your course thumbnail.
        </p>

        {errors.thumbnailUrl && (
          <p className="mt-1.5 text-sm text-red-600">
            {errors.thumbnailUrl}
          </p>
        )}
      </div>

      {/* Thumbnail Preview */}
      {formData.thumbnailUrl && !errors.thumbnailUrl && (
        <div>
          <p className="mb-2 text-sm font-semibold text-slate-700">
            Thumbnail Preview
          </p>

          <img
            src={formData.thumbnailUrl}
            alt="Course thumbnail preview"
            className="aspect-video w-full max-w-sm rounded-xl border border-slate-200 object-cover"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
        </div>
      )}

      {/* Form Actions */}
      <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <Link
          to="/instructor/courses"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <ArrowLeft size={17} />
          Cancel
        </Link>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save size={17} />
          {isSubmitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}

export default CourseForm;