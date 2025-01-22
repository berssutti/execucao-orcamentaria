<template>
    <div>
      <h4 class="mb-3"><v-icon class="mr-1">mdi-note-text-outline</v-icon>Célula Orçamentária</h4>
      <v-row>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="project.nota_dotacao"
            label="Nota de Dotação"
            clearable
            :rules="[rules.required]"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="project.ptres"
            label="PTRES"
            clearable
            :rules="[rules.required]"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="project.ugr"
            label="UGR"
            clearable
            :rules="[rules.required]"
            required
          ></v-text-field>
        </v-col>
      </v-row>
    </div>
  </template>
  
  <script setup>
  defineProps({
    project: Object,
    rules: Object,
  });
  
  defineEmits(['update:project']);
  </script>