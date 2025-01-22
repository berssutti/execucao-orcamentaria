<template>
    <div>
      <h4 class="mb-3"><v-icon>mdi-cash-multiple</v-icon>Orçamento</h4>
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="project.total_unb_amount_expected"
            label="Custos Indiretos UnB"
            type="number"
            prefix="R$"
            clearable
            :rules="[rules.required, rules.positive]"
            placeholder="Valor esperado para UnB"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="project.total_fcte_amount_expected"
            label="Custos Indiretos FCTE"
            type="number"
            prefix="R$"
            clearable
            :rules="[rules.required, rules.positive]"
            placeholder="Valor esperado para FCTE"
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