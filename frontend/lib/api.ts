export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  email: string;
  role: "student" | "teacher" | "admin";
}

export async function loginUser(payload: LoginRequest): Promise<LoginResponse> {
  const res = await fetch("http://localhost:8080/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || "Login failed");
  }

  return res.json();
}

export interface LeadData {
  name: string;
  email: string;
  phone: string;
  program?: string;
  message?: string;
  studentClass?: string; // Optional, for enrollment
}

export async function submitContactForm(data: LeadData) {
  const res = await fetch("http://localhost:8080/api/leads/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to submit contact form");
  return res.json();
}

export async function submitEnrollment(data: LeadData) {
  const res = await fetch("http://localhost:8080/api/leads/enroll", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to submit enrollment");
  return res.json();
}

export async function getLeads() {
  const token = localStorage.getItem("token"); // Assuming you store JWT
  const res = await fetch("http://localhost:8080/api/leads", {
    headers: { 
        "Authorization": `Bearer ${token}` 
    },
  });
  if (!res.ok) throw new Error("Failed to fetch leads");
  return res.json();
}

export async function updateLeadStatus(id: number, status: string) {
  const token = localStorage.getItem("token");
  const res = await fetch(`http://localhost:8080/api/leads/${id}/status`, {
    method: "PUT",
    headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update status");
  return res.json();
}