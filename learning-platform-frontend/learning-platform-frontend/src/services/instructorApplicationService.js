import api from "./api";

const submitApplication = async (applicationData) => {
  const response = await api.post(
    "/instructor-applications",
    applicationData
  );

  return response.data;
};

const getMyApplications = async () => {
  const response = await api.get("/instructor-applications/me");
  return response.data;
};

const instructorApplicationService = {
  submitApplication,
  getMyApplications,
};

export default instructorApplicationService;