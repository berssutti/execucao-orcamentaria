import { createRouter, createWebHistory } from 'vue-router';

import ProjectForm from '@/components/ProjectForm.vue';
import ProjectList from '@/components/ProjectList.vue';

const routes = [
  {
    path: '/projects/list',
    name: 'ProjectList',
    component: ProjectList,
    meta: { title: 'Lista de Projetos'} 
  },
  {
    path: '/projects/create',
    name: 'ProjectCreate',
    component: ProjectForm,
    meta: { title: 'Cadastrar Projeto'}
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Execução Orçamentária';
  next();
})

export default router;
