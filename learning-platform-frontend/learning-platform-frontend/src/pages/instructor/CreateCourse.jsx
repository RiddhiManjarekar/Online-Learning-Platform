import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";

import CourseForm from "../../components/instructor/CourseForm";
import courseService from "../../services/courseService";

function CreateCourse() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: courseService.createCourse,

    onSuccess: (course) => {
      queryClient.invalidateQueries({
        queryKey: ["instructorCourses"],
      });

      // Navigate to the lesson manager after creating the draft.
      navigate(`/instructor/courses/${course.id}/lessons`);
    },
  });

  const errorMessage =
    createMutation.error?.response?.data?.detail ||
    createMutation.error?.response?.data?.message ||
    createMutation.error?.message;

  return (
    <div className="mx-auto w-full max-w-4xl space-y-7">
      {/* Page Heading */}
      <div>
        <p className="text-sm font-semibold text-indigo-600">
          Course Management
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Create a New Course
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Add your course details. You can add lessons and publish it
          afterwards.
        </p>
      </div>

      {/* Information Card */}
      <div className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-violet-50 p-5">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-white p-2.5 text-indigo-600 shadow-sm">
            <BookOpen size={21} />
          </div>

          <div>
            <p className="text-sm font-semibold text-indigo-950">
              Your course will initially be saved as a draft.
            </p>

            <p className="mt-1 text-sm leading-6 text-indigo-700">
              Add at least one YouTube lesson before publishing your course.
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {errorMessage}
        </div>
      )}

      {/* Course Form */}
      <CourseForm
        onSubmit={(data) => createMutation.mutate(data)}
        isSubmitting={createMutation.isPending}
        submitLabel="Create Course"
      />
    </div>
  );
}

export default CreateCourse;