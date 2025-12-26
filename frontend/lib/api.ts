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


// Add this to your api.ts file

const PUBLIC_VAPID_KEY = "BFAV77TAOueW7pEucmzQLwMrrfKTfcjVSN4u_KVejTOHmwL7iRzb_jqPy2MF_0sZ54_q1u3MO5LRqZ5RDztEZtc"; 

// Helper to convert key
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function subscribeToPushNotifications(token: string) {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    try {
      // 1. Register the Service Worker
      await navigator.serviceWorker.register('/sw.js');
      
      // 2. [FIX] Wait for the Service Worker to be ACTIVE
      const registration = await navigator.serviceWorker.ready; 
      
      // 3. Attempt to subscribe
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY)
      });

      // 4. Send subscription to backend
      await fetch("http://localhost:8080/api/notifications/subscribe", {
        method: "POST",
        body: JSON.stringify(subscription),
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      
      console.log("Push Notification Subscribed!");
    } catch (e) {
      console.error("Failed to subscribe to push", e);
    }
  } else {
    console.warn("Push notifications are not supported in this browser.");
  }
}