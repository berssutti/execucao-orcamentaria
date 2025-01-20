import { createRouter, createWebHistory } from 'vue-router';

// import ProjectForm from '@/components/ProjectForm.vue';
import ProjectForm from '@/components/project/form/ProjectForm.vue';

// import ProjectList from '@/components/ProjectList.vue';
import ProjectList from '@/views/ProjectListView.vue';

// import ProjectDetails from '@/components/ProjectDetails.vue';
import ProjectDetails from '@/views/ProjectDetailsView.vue';

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
  {
    path: '/projects/edit/:id',
    name: 'ProjectEdit',
    component: ProjectForm,
    props: true,
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
