/**
 * CampusPulse Centralized API Client Helper
 */

export async function apiRequest<T = any>(
  endpoint: string,
  options: {
    method?: string;
    body?: any;
    headers?: Record<string, string>;
  } = {}
): Promise<{ success: boolean; data?: T; message?: string; error?: string }> {
  try {
    const method = options.method || "GET";
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    const config: RequestInit = {
      method,
      headers,
      credentials: "include",
    };

    if (options.body && method !== "GET") {
      config.body = JSON.stringify(options.body);
    }

    const res = await fetch(endpoint, config);
    const result = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: result.message || "API request failed",
        error: result.message || "API error",
      };
    }

    return {
      success: true,
      data: result.data !== undefined ? result.data : result,
      message: result.message,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Network error",
      error: error.message,
    };
  }
}

// Student APIs
export const studentApi = {
  getDashboard: () => apiRequest("/api/student/dashboard"),
  getAssignments: () => apiRequest("/api/student/assignments"),
  getAssignmentDetails: (id: string) => apiRequest(`/api/student/assignments/${id}`),
  submitAssignment: (id: string, body: { solutionText?: string; githubLink?: string; fileName?: string; fileUrl?: string }) =>
    apiRequest(`/api/student/assignments/${id}/submit`, { method: "POST", body }),
  getAttendance: () => apiRequest("/api/student/attendance"),
  getResults: () => apiRequest("/api/student/results"),
  getTimetable: () => apiRequest("/api/student/timetable"),
  getFees: () => apiRequest("/api/student/fees"),
  getEvents: () => apiRequest("/api/student/events"),
  getNotifications: () => apiRequest("/api/student/notifications"),
};

// Faculty APIs
export const facultyApi = {
  getDashboard: () => apiRequest("/api/faculty/dashboard"),
  getAssignedSubjects: () => apiRequest("/api/faculty/subjects"),
  getStudents: () => apiRequest("/api/faculty/students"),
  getAssignments: () => apiRequest("/api/faculty/assignments"),
  createAssignment: (body: any) => apiRequest("/api/faculty/assignments", { method: "POST", body }),
  getSubmissions: (assignmentId: string) => apiRequest(`/api/faculty/assignments/${assignmentId}/submissions`),
  reviewSubmission: (submissionId: string, body: { marksObtained: number; feedback?: string }) =>
    apiRequest(`/api/faculty/submissions/${submissionId}/review`, { method: "PUT", body }),
  markAttendance: (body: any) => apiRequest("/api/faculty/attendance", { method: "POST", body }),
  createResult: (body: any) => apiRequest("/api/faculty/results", { method: "POST", body }),
};

// Coordinator APIs
export const coordinatorApi = {
  getDashboard: () => apiRequest("/api/coordinator/dashboard"),
  getDepartments: () => apiRequest("/api/coordinator/departments"),
  createDepartment: (body: any) => apiRequest("/api/coordinator/departments", { method: "POST", body }),
  getCourses: () => apiRequest("/api/coordinator/courses"),
  createCourse: (body: any) => apiRequest("/api/coordinator/courses", { method: "POST", body }),
  getSubjects: () => apiRequest("/api/coordinator/subjects"),
  createSubject: (body: any) => apiRequest("/api/coordinator/subjects", { method: "POST", body }),
  assignFaculty: (body: any) => apiRequest("/api/coordinator/assignments", { method: "POST", body }),
  createAnnouncement: (body: any) => apiRequest("/api/coordinator/announcements", { method: "POST", body }),
};

// Admin APIs
export const adminApi = {
  getDashboard: () => apiRequest("/api/admin/dashboard"),
  getAnalyticsOverview: () => apiRequest("/api/admin/analytics/overview"),
  getUsers: (query?: string) => apiRequest(`/api/admin/users${query ? `?${query}` : ""}`),
  createUser: (body: any) => apiRequest("/api/admin/users", { method: "POST", body }),
  createAnnouncement: (body: any) => apiRequest("/api/admin/announcements", { method: "POST", body }),
};
