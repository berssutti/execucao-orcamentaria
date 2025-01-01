<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>Execução Orçamentária</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>

  </v-app>
</template>

<script>
  export default {
    name: 'App',
  };
</script>

<style>
.v-main {
  min-height: calc(100vh - 64px - 56px); /* Altura da Barra + Rodapé */
}
</style>
