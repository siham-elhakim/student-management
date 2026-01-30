// Check authentication on page load
document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    // Redirect to login if no token
    window.location.href = 'login.html';
    return;
  }

  // Verify token is still valid
  verifyToken();
  loadStudents();
  setupLogout();
});

// Verify token validity
async function verifyToken() {
  const token = localStorage.getItem('token');
  
  try {
    const response = await fetch('/api/health');
    if (!response.ok) throw new Error('Server error');
  } catch (error) {
    console.error('Server check failed:', error);
  }
}

// Setup logout
function setupLogout() {
  const logoutBtn = document.getElementById('logoutBtn');
  const userName = document.getElementById('userName');
  
  // Get user info from localStorage
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const user = JSON.parse(userInfo);
    userName.textContent = `Welcome, ${user.name}`;
  }

  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    window.location.href = 'login.html';
  });
}

// Get authorization header
function getAuthHeader() {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
}

// DOM Elements
const studentForm = document.getElementById('studentForm');
const editForm = document.getElementById('editForm');
const editModal = document.getElementById('editModal');
const closeModal = document.querySelector('.close');
const cancelBtn = document.getElementById('cancelBtn');
const clearBtn = document.getElementById('clearBtn');
const searchBtn = document.getElementById('searchBtn');
const resetBtn = document.getElementById('resetBtn');
const searchInput = document.getElementById('searchInput');
const studentsTableBody = document.getElementById('studentsTableBody');
const emptyMessage = document.getElementById('emptyMessage');
const messageDiv = document.getElementById('message');

// Set today's date as default
document.getElementById('enrollmentDate').valueAsDate = new Date();

// Event Listeners
studentForm.addEventListener('submit', handleAddStudent);
editForm.addEventListener('submit', handleEditStudent);
clearBtn.addEventListener('click', clearForm);
closeModal.addEventListener('click', () => closeEditModal());
cancelBtn.addEventListener('click', () => closeEditModal());
searchBtn.addEventListener('click', handleSearch);
resetBtn.addEventListener('click', resetSearch);
window.addEventListener('click', (event) => {
  if (event.target === editModal) {
    closeEditModal();
  }
});

// Load all students
async function loadStudents() {
  try {
    const response = await fetch('/api/students', {
      headers: getAuthHeader()
    });
    
    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = 'login.html';
      return;
    }
    
    if (!response.ok) throw new Error('Failed to load students');
    
    const students = await response.json();
    displayStudents(students);
  } catch (error) {
    showMessage('Error loading students: ' + error.message, 'error');
    console.error('Error:', error);
  }
}

// Display students in table
function displayStudents(students) {
  studentsTableBody.innerHTML = '';
  
  if (students.length === 0) {
    emptyMessage.classList.add('show');
  } else {
    emptyMessage.classList.remove('show');
    students.forEach(student => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${student.id}</td>
        <td>${escapeHtml(student.name)}</td>
        <td>${escapeHtml(student.email)}</td>
        <td>${student.phone ? escapeHtml(student.phone) : '-'}</td>
        <td>${student.address ? escapeHtml(student.address) : '-'}</td>
        <td>${formatDate(student.enrollmentDate)}</td>
        <td><span class="status-badge status-${student.status.toLowerCase()}">${student.status}</span></td>
        <td>
          <div class="actions">
            <button class="btn btn-edit" onclick="openEditModal(${student.id})">Edit</button>
            <button class="btn btn-danger" onclick="deleteStudent(${student.id})">Delete</button>
          </div>
        </td>
      `;
      studentsTableBody.appendChild(row);
    });
  }
}

// Handle add student
async function handleAddStudent(e) {
  e.preventDefault();
  
  const formData = {
    name: document.getElementById('name').value.trim(),
    email: document.getElementById('email').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    address: document.getElementById('address').value.trim(),
    enrollmentDate: document.getElementById('enrollmentDate').value,
    status: document.getElementById('status').value
  };

  // Validate
  if (!formData.name || !formData.email || !formData.enrollmentDate) {
    showMessage('Please fill in all required fields', 'error');
    return;
  }

  try {
    const response = await fetch('/api/students', {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(formData)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to add student');
    }

    showMessage('Student added successfully!', 'success');
    clearForm();
    loadStudents();
  } catch (error) {
    showMessage('Error: ' + error.message, 'error');
    console.error('Error:', error);
  }
}

// Open edit modal
async function openEditModal(studentId) {
  try {
    const response = await fetch(`/api/students/${studentId}`, {
      headers: getAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to load student');
    
    const student = await response.json();
    
    document.getElementById('editId').value = student.id;
    document.getElementById('editName').value = student.name;
    document.getElementById('editEmail').value = student.email;
    document.getElementById('editPhone').value = student.phone || '';
    document.getElementById('editAddress').value = student.address || '';
    document.getElementById('editEnrollmentDate').value = student.enrollmentDate;
    document.getElementById('editStatus').value = student.status;
    
    editModal.classList.add('show');
  } catch (error) {
    showMessage('Error loading student: ' + error.message, 'error');
    console.error('Error:', error);
  }
}

// Close edit modal
function closeEditModal() {
  editModal.classList.remove('show');
  editForm.reset();
}

// Handle edit student
async function handleEditStudent(e) {
  e.preventDefault();
  
  const studentId = document.getElementById('editId').value;
  const formData = {
    name: document.getElementById('editName').value.trim(),
    email: document.getElementById('editEmail').value.trim(),
    phone: document.getElementById('editPhone').value.trim(),
    address: document.getElementById('editAddress').value.trim(),
    enrollmentDate: document.getElementById('editEnrollmentDate').value,
    status: document.getElementById('editStatus').value
  };

  // Validate
  if (!formData.name || !formData.email || !formData.enrollmentDate) {
    showMessage('Please fill in all required fields', 'error');
    return;
  }

  try {
    const response = await fetch(`/api/students/${studentId}`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify(formData)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to update student');
    }

    showMessage('Student updated successfully!', 'success');
    closeEditModal();
    loadStudents();
  } catch (error) {
    showMessage('Error: ' + error.message, 'error');
    console.error('Error:', error);
  }
}

// Delete student
async function deleteStudent(studentId) {
  if (!confirm('Are you sure you want to delete this student?')) {
    return;
  }

  try {
    const response = await fetch(`/api/students/${studentId}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });

    if (!response.ok) throw new Error('Failed to delete student');

    showMessage('Student deleted successfully!', 'success');
    loadStudents();
  } catch (error) {
    showMessage('Error: ' + error.message, 'error');
    console.error('Error:', error);
  }
}

// Handle search
async function handleSearch() {
  const searchQuery = searchInput.value.trim();
  
  if (!searchQuery) {
    showMessage('Please enter a search term', 'error');
    return;
  }

  try {
    const response = await fetch(`/api/students/search/${encodeURIComponent(searchQuery)}`, {
      headers: getAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to search students');
    
    const students = await response.json();
    displayStudents(students);
    
    if (students.length === 0) {
      showMessage('No students found matching your search', 'error');
    }
  } catch (error) {
    showMessage('Error: ' + error.message, 'error');
    console.error('Error:', error);
  }
}

// Reset search
function resetSearch() {
  searchInput.value = '';
  loadStudents();
}

// Clear form
function clearForm() {
  studentForm.reset();
  document.getElementById('enrollmentDate').valueAsDate = new Date();
}

// Show message
function showMessage(message, type) {
  messageDiv.textContent = message;
  messageDiv.className = `message ${type}`;
  
  setTimeout(() => {
    messageDiv.className = 'message';
  }, 5000);
}

// Format date
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

// Escape HTML
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}
