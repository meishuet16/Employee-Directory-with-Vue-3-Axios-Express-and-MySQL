<script setup>
import { ref, computed, onMounted } from 'vue'
import EmployeeForm from './components/EmployeeForm.vue'
import EmployeeList from './components/EmployeeList.vue'
import SearchSort   from './components/SearchSort.vue'
import {
  getEmployees, createEmployee, updateEmployee, deleteEmployee
} from './api/employeeApi.js'

const employees       = ref([])   
const editingEmployee = ref(null) 
const loading         = ref(false)
const errorMsg        = ref('')   
const serverErrors    = ref({})   

const currentFilters = ref({ q: '', sortBy: '', order: 'asc' })

const totalActive = computed(() =>
  employees.value.filter(e => e.active).length
)


async function load(filters = currentFilters.value) {
  currentFilters.value = filters
  loading.value  = true
  errorMsg.value = ''
  try {
    const { data } = await getEmployees(filters)
    employees.value = data
  } catch (err) {
    errorMsg.value = err.userMessage || 'Failed to load employees.'
  } finally {
    loading.value = false 
  }
}

function handleSearch(filters) {
  load(filters)
}

async function handleSave(payload) {
  serverErrors.value = {}
  errorMsg.value     = ''
  try {
    if (editingEmployee.value) {
      await updateEmployee(editingEmployee.value.id, payload)
      editingEmployee.value = null 
    } else {
      await createEmployee(payload)
    }
    await load() 
  } catch (err) {
    
    if (err.response?.status === 400 && err.response.data?.errors) {
      serverErrors.value = err.response.data.errors
    } else {
      errorMsg.value = err.userMessage || 'Save failed. Please try again.'
    }
  }
}

function handleEdit(emp) {
  serverErrors.value    = {}
  editingEmployee.value = { ...emp } 
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function handleCancel() {
  editingEmployee.value = null
  serverErrors.value    = {}
}

async function handleDelete(id) {
  const emp  = employees.value.find(e => e.id === id)
  const name = emp ? emp.name : 'this employee'
  if (!confirm(`Delete ${name}? This action cannot be undone.`)) return

  errorMsg.value = ''
  try {
    await deleteEmployee(id)
    await load()
  } catch (err) {
    errorMsg.value = err.userMessage || 'Delete failed. Please try again.'
  }
}

onMounted(load)
</script>

<template>
  <header class="app-header">
    <div class="header-inner">
      <div>
        <h1>🏢 Employee Directory</h1>
        <p class="subtitle">Human Resources · Internal Tool</p>
      </div>
    </div>
  </header>

  <main class="app-main">

    <p v-if="loading" class="state-loading">⏳ Loading employees…</p>

    <div v-if="errorMsg" class="state-error" role="alert">
      ⚠️ {{ errorMsg }}
      <button class="btn-dismiss" @click="errorMsg = ''">✕</button>
    </div>

    <EmployeeForm
      :editingEmployee="editingEmployee"
      :serverErrors="serverErrors"
      @save="handleSave"
      @cancel="handleCancel"
    />

    <SearchSort
      :totalActive="totalActive"
      :totalAll="employees.length"
      @search="handleSearch"
    />

    <EmployeeList
      :employees="employees"
      @edit="handleEdit"
      @delete="handleDelete"
    />

  </main>

  <footer class="app-footer">
    <p>Chapter 8 Individual Assignment · Vue 3 + Axios + Express + MySQL</p>
  </footer>
</template>