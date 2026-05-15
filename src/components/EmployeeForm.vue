<!-- add/edit employee form,has complete validation -->
<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  editingEmployee: { type: Object, default: null }, // 要编辑的员工（null=新增模式）
  serverErrors:    { type: Object, default: () => ({}) } // 后端回来的验证错误
})

const emit = defineEmits(['save', 'cancel'])
const emptyForm = () => ({
  empId:      '',
  name:       '',
  email:      '',
  department: '',
  position:   '',
  hireDate:   '',
  salary:     '',
  active:     true
})

const form   = ref(emptyForm()) 
const errors = ref({})        

watch(() => props.editingEmployee, (val) => {
  form.value   = val ? { ...val } : emptyForm()
  // { ...val } = copy one object to another, so that editing the form won't change the original object until we save
  errors.value = {}
}, { immediate: true }) // immediate =execute immediately on first run

watch(() => props.serverErrors, (val) => {
  if (val && Object.keys(val).length)
    errors.value = { ...errors.value, ...val }
}, { deep: true })


const isEditing = computed(() => Boolean(props.editingEmployee))

const empIdRegex = /^EMP[0-9]{3,5}$/
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate() {
  const e = {}

  if (!form.value.empId.trim())
    e.empId = 'Employee ID is required.'
  else if (!empIdRegex.test(form.value.empId.trim().toUpperCase()))
    e.empId = 'Format: EMP followed by 3-5 digits (e.g. EMP001).'

  if (!form.value.name.trim() || form.value.name.trim().length < 3)
    e.name = 'Full name must be at least 3 characters.'

  if (!emailRegex.test(form.value.email.trim()))
    e.email = 'Please enter a valid email address.'

  if (!form.value.department)
    e.department = 'Please select a department.'

  if (!form.value.position.trim())
    e.position = 'Position / job title is required.'

  if (!form.value.hireDate) {
    e.hireDate = 'Hire date is required.'
  } else {
    const today    = new Date()
    today.setHours(0, 0, 0, 0) //only compare date part not time
    const selected = new Date(form.value.hireDate)
    if (selected > today)
      e.hireDate = 'Hire date cannot be in the future.'
  }

  const sal = Number(form.value.salary)
  if (!form.value.salary && form.value.salary !== 0)
    e.salary = 'Salary is required.'
  else if (isNaN(sal) || sal < 1500 || sal > 50000)
    e.salary = 'Salary must be between RM 1,500 and RM 50,000.'

  errors.value = e
  return Object.keys(e).length === 0
}

function onSubmit() {
  if (!validate()) return 

  emit('save', {
    ...form.value,
    empId:    form.value.empId.trim().toUpperCase(),
    name:     form.value.name.trim(),
    email:    form.value.email.trim(),
    position: form.value.position.trim(),
    salary:   Number(form.value.salary),
  })

  if (!isEditing.value) form.value = emptyForm() 
}

function onCancel() {
  emit('cancel')
  form.value   = emptyForm()
  errors.value = {}
}
</script>

<template>
  <!-- @submit.prevent =preventDefault -->
  <form @submit.prevent="onSubmit" class="employee-form" novalidate>
    <h3>{{ isEditing ? '✏️ Edit Employee' : '➕ Add New Employee' }}</h3>

    <div class="form-grid">

      <label class="form-field">
        <span>Employee ID</span>
        <input
          v-model.trim="form.empId"
          placeholder="EMP001"
          :class="{ invalid: errors.empId }"
        />
        <span v-if="errors.empId" class="err">{{ errors.empId }}</span>
      </label>

      <label class="form-field">
        <span>Full Name</span>
        <input
          v-model.trim="form.name"
          placeholder="e.g. Ahmad bin Hassan"
          :class="{ invalid: errors.name }"
        />
        <span v-if="errors.name" class="err">{{ errors.name }}</span>
      </label>

      <label class="form-field">
        <span>Email</span>
        <input
          v-model.trim="form.email"
          type="email"
          placeholder="employee@company.com.my"
          :class="{ invalid: errors.email }"
        />
        <span v-if="errors.email" class="err">{{ errors.email }}</span>
      </label>

      <label class="form-field">
        <span>Department</span>
        <select v-model="form.department" :class="{ invalid: errors.department }">
          <option value="">— Select Department —</option>
          <option>IT</option>
          <option>HR</option>
          <option>Finance</option>
          <option>Marketing</option>
          <option>Operations</option>
        </select>
        <span v-if="errors.department" class="err">{{ errors.department }}</span>
      </label>

      <label class="form-field">
        <span>Position / Job Title</span>
        <input
          v-model.trim="form.position"
          placeholder="e.g. Software Engineer"
          :class="{ invalid: errors.position }"
        />
        <span v-if="errors.position" class="err">{{ errors.position }}</span>
      </label>

      <label class="form-field">
        <span>Hire Date</span>
        <input
          v-model="form.hireDate"
          type="date"
          :max="new Date().toISOString().split('T')[0]"
          :class="{ invalid: errors.hireDate }"
        />
        <span v-if="errors.hireDate" class="err">{{ errors.hireDate }}</span>
      </label>

      <label class="form-field">
        <span>Monthly Salary (RM)</span>
        <input
          v-model.number="form.salary"
          type="number"
          step="100"
          min="1500"
          max="50000"
          placeholder="e.g. 5000"
          :class="{ invalid: errors.salary }"
        />
        <span v-if="errors.salary" class="err">{{ errors.salary }}</span>
      </label>

      <label class="form-field check-field">
        <input type="checkbox" v-model="form.active" />
        <span>Currently employed (Active)</span>
      </label>

    </div>

    <div class="form-actions">
      <button type="submit" class="btn-primary">
        {{ isEditing ? 'Update Employee' : 'Add Employee' }}
      </button>
      <button v-if="isEditing" type="button" class="btn-secondary" @click="onCancel">
        Cancel
      </button>
    </div>
  </form>
</template>