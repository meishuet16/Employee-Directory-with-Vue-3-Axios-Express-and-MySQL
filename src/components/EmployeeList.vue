<!-- display list of employees -->
<script setup>
defineProps({ employees: { type: Array, required: true } })
const emit = defineEmits(['edit', 'delete'])

const rmFormat = new Intl.NumberFormat('ms-MY', {
  style:                 'currency',
  currency:              'MYR',
  minimumFractionDigits: 2
})
function formatSalary(val) {
  return rmFormat.format(Number(val))
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-MY', {
    year:  'numeric',
    month: 'short',
    day:   '2-digit'
  })
}
</script>

<template>
  <div v-if="!employees.length" class="empty-state">
    <p>No employees found. Add one above or clear the search filter.</p>
  </div>

  <div v-else class="table-wrapper">
    <table class="employee-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name &amp; Email</th>
          <th>Department</th>
          <th>Position</th>
          <th>Hire Date</th>
          <th>Salary</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="emp in employees"
          :key="emp.id"
          :class="{ 'row-inactive': !emp.active }"
        >
          <td><code>{{ emp.empId }}</code></td>

          <td>
            <strong>{{ emp.name }}</strong>
            <div class="muted">{{ emp.email }}</div>
          </td>

          <td>{{ emp.department }}</td>
          <td>{{ emp.position }}</td>

          <td>{{ formatDate(emp.hireDate) }}</td>

          <td class="salary-cell">{{ formatSalary(emp.salary) }}</td>
          <td>
            <span :class="emp.active ? 'badge active' : 'badge inactive'">
              {{ emp.active ? 'Active' : 'Inactive' }}
            </span>
          </td>

          <td class="action-cell">
            <button class="btn-edit" @click="emit('edit', emp)">Edit</button>
            <button class="btn-delete" @click="emit('delete', emp.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>