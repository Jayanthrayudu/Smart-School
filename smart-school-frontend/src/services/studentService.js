// // src/services/studentService.js
// import api from "./api";

// // ✅ Fetch all students (for teacher/admin usage)
// export const getAllStudents = async () => {
//   try {
//     const response = await api.get("/admin/students");
//     return response.data;
//   } catch (err) {
//     console.error("Failed to fetch students:", err);
//     throw err;
//   }
// };

// // ✅ Fetch a single student by ID
// export const getStudentById = async (studentId) => {
//   try {
//     const response = await api.get(`/admin/students/${studentId}`);
//     return response.data;
//   } catch (err) {
//     console.error(`Failed to fetch student with ID ${studentId}:`, err);
//     throw err;
//   }
// };

// // ✅ Create a new student
// export const createStudent = async (data) => {
//   try {
//     const response = await api.post("/admin/students", data);
//     return response.data;
//   } catch (err) {
//     console.error("Failed to create student:", err);
//     throw err;
//   }
// };

// // ✅ Update student details
// export const updateStudent = async (studentId, data) => {
//   try {
//     const response = await api.put(`/admin/students/${studentId}`, data);
//     return response.data;
//   } catch (err) {
//     console.error(`Failed to update student with ID ${studentId}:`, err);
//     throw err;
//   }
// };

// // ✅ Delete a student
// export const deleteStudent = async (studentId) => {
//   try {
//     const response = await api.delete(`/admin/students/${studentId}`);
//     return response.data;
//   } catch (err) {
//     console.error(`Failed to delete student with ID ${studentId}:`, err);
//     throw err;
//   }
// };
