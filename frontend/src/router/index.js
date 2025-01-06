import { createRouter, createWebHistory } from 'vue-router';

import ProjectForm from '@/components/ProjectForm.vue';
import ProjectList from '@/components/ProjectList.vue';
import ProjectDetails from '@/components/ProjectDetails.vue';

const routes = [
  {
    path: '/projects',
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
  {
    path: '/projects/:id',
    name: 'ProjectDetails',
    component: ProjectDetails,
    props: true,
    meta: {title: 'Detalhes do Projeto'}
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
