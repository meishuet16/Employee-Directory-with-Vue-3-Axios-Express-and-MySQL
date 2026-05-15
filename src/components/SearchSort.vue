<!-- search bar, headcount, and sort controls -->

<script setup>
import { ref, watch } from 'vue'

defineProps({
  totalActive: { type: Number, default: 0 }, 
  totalAll:    { type: Number, default: 0 }  
})

const emit = defineEmits(['search'])

const q      = ref('') 
const sortBy = ref('') 
const order  = ref('asc') 

watch([q, sortBy, order], () => {
  emit('search', {
    q:      q.value.trim(),
    sortBy: sortBy.value,
    order:  order.value
  })
})

function clearSearch() {
  q.value      = ''
  sortBy.value = ''
  order.value  = 'asc'
}
</script>

<template>
  <div class="search-bar">
    <div class="headcount">
      <span class="headcount-active">{{ totalActive }} active</span>
      <span class="headcount-total"> / {{ totalAll }} total</span>
    </div>

    <div class="search-group">
      <input
        v-model.trim="q"
        type="search"
        placeholder="Search by name, ID or email…"
        class="search-input"
      />

      <button v-if="q" class="btn-clear" @click="clearSearch" title="Clear">✕</button>
    </div>

    <div class="sort-group">
      <select v-model="sortBy" class="sort-select">
        <option value="">Sort by…</option>
        <option value="name">Name</option>
        <option value="hireDate">Hire Date</option>
        <option value="salary">Salary</option>
        <option value="department">Department</option>
      </select>
      <select v-model="order" :disabled="!sortBy" class="sort-select">
        <option value="asc">↑ Asc</option>
        <option value="desc">↓ Desc</option>
      </select>
    </div>

  </div>
</template>