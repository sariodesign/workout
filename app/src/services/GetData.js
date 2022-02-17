import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://my-json-server.typicode.com/sariodesign/workout/",
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export default {
  getNutrition() {
    return apiClient.get("/nutrition");
  },
  getExercise() {
    return apiClient.get("/exercise");
  },
};
