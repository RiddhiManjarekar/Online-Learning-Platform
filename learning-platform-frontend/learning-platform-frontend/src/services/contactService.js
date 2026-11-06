import api from "./api";

const submitContactMessage = async (contactData) => {
  const response = await api.post("/contact", contactData);
  return response.data;
};

const contactService = {
  submitContactMessage,
};

export default contactService;