import { createRouter, createWebHistory } from "vue-router";
import Exercise from "../views/Exercise.vue";

const routes = [
  {
    path: "/",
    name: "WorkoutTimer",
    component: Exercise,
  },
  {
    path: "/exercise",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
