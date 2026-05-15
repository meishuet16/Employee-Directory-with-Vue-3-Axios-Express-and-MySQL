import axios from 'axios'
const apiClient = axios.create({
  baseURL: 'http://localhost:3001', 
  timeout: 8000,                    // 8 seconds timeout
  headers: {
    'Content-Type': 'application/json', // i pass JSON data in request body
    Accept: 'application/json'          // i want to receive JSON format
  }
})

//Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.log(`[API →] ${config.method?.toUpperCase()} ${config.url}`)
    return config 
  },
  (error) => Promise.reject(error)
)

//Response Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status
      if (status === 409)
        error.userMessage = 'Employee ID already exists. Please use a different ID.'
      else if (status === 404)
        error.userMessage = 'Record not found — it may have been deleted.'
      else if (status === 400)
        error.userMessage = 'Validation failed. Please check the highlighted fields.'
      else
        error.userMessage = `Server error (${status}). Please try again later.`
      console.error(`[API ←] ${status} ${error.response.statusText}`)
    } else if (error.request) {
      error.userMessage = 'Cannot reach the server. Is the API running on port 3001?'
      console.error('[API ←] No response received.')
    } else {
      error.userMessage = 'An unexpected error occurred.'
      console.error('[API] Error:', error.message)
    }
    return Promise.reject(error)
  }
)

//CRUD 
export const getEmployees = (params = {}) =>
  apiClient.get('/employees', { params })

export const getEmployee = (id) =>
  apiClient.get(`/employees/${id}`)

export const createEmployee = (data) =>
  apiClient.post('/employees', data)

export const updateEmployee = (id, data) =>
  apiClient.put(`/employees/${id}`, data)

export const deleteEmployee = (id) =>
  apiClient.delete(`/employees/${id}`)

export default apiClient