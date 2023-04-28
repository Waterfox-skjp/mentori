import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'top',
    component: async () => {
      const top = await import('../pages/Top.vue');
      return top;
    }
  },
  {
    path: '/privacy-policy',
    name: 'privacy-policy',
    strict: true,
    component: async () => {
      const privacypolicy = await import('../pages/Privacypolicy.vue');
      return privacypolicy;
    }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;
