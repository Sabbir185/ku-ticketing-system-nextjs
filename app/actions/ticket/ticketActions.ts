"use server";
import { cookies } from "next/headers";

export async function createTicket(formData: FormData) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return {
        success: false,
        message: "Authentication token not found",
      };
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ticket`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // ✅ Only set auth
        // DO NOT set 'Content-Type' manually
      },
      body: formData, // ✅ send raw formData
    });

    const data = await res.json();

    if (!res.ok || data?.error) {
      return {
        success: false,
        message: data?.msg || "Failed to add ticket",
      };
    }

    return {
      success: true,
      data: data?.data,
    };
  } catch (error) {
    console.error("Ticket creation error:", error);
    return {
      success: false,
      message: "Failed to create ticket",
    };
  }
}
export async function deleteTicket(formData : FormData) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;
    if (!token) {
      return {
        success: false,
        message: "Authentication token not found",
      };
    }
    const Category = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/ticket",
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: formData.get("id") as string,
        }),
      }
    );
    console.log("🚀 ~ deleteTicket ~ Category:", Category)
    const userData = await Category.json();
    if (userData?.error) {
      return {
        success: false,
        message: userData?.msg || "Failed to delete user tickets",
      };
    }
  
    return {
      success: true,
      data: userData?.data,
    };
  } catch (error) {
    console.log("Login error:", error);
    return {
      success: false,
      message: "Failed to fetch user tickets",
    };
  }
}

export async function fetchUserTickets(formData : FormData) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;
    if (!token) {
      return {
        success: false,
        message: "Authentication token not found",
      };
    }
    const Category = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/ticket/me",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );    
    const userData = await Category.json();
    if (userData?.error) {
      return {
        success: false,
        message: userData?.msg || "Failed to fetch user tickets",
      };
    }
  
    return {
      success: true,
      data: userData?.data,
    };
  } catch (error) {
    console.log("Login error:", error);
    return {
      success: false,
      message: "Failed to fetch user tickets",
    };
  }
    
}

export async function fetchEmployeeTickets() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return {
        success: false,
        message: "Authentication token not found",
      };
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ticket`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();

    if (result?.error) {
      return {
        success: false,
        message: result?.msg || "Failed to fetch employee tickets",
      };
    }

    return {
      success: true,
      data: result?.data,
    };
  } catch (error) {
    console.error("Fetch employee tickets error:", error);
    return {
      success: false,
      message: "Failed to fetch employee tickets",
    };
  }
}
export async function fetchTicket(id: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;
    if (!token) {
      return {
        success: false,
        message: "Authentication token not found",
      };
    }
    const Category = await fetch(
      process.env.NEXT_PUBLIC_API_URL + `/ticket/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("🚀 ~ fetchTicket ~ Category:", Category)
    const userData = await Category.json();
    console.log("🚀 ~ fetchTicket ~ userData:", userData)
    if (userData?.error) {
      return {
        success: false,
        message: userData?.msg || "Failed to fetch ticket",
      };
    }
  
    return {
      success: true,
      data: userData?.data,
    };
  } catch (error) {
    console.log("Login error:", error);
    return {
      success: false,
      message: "Failed to fetch ticket",
    };
  }
}
export async function resolveTicket(formData: FormData) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;
    if (!token) {
      return {
        success: false,
        message: "Authentication token not found",
      };
    }
    const Category = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/ticket/reply",
      {
        method: "POST",
        headers: {
          // "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );
    console.log("🚀 ~ resolveTicket ~ Category:", Category)
    const userData = await Category.json();
    if (userData?.error) {
      return {
        success: false,
        message: userData?.msg || "Failed to resolve ticket",
      };
    }
  
    return {
      success: true,
      data: userData?.data,
    };
  } catch (error) {
    console.log("Login error:", error);
    return {
      success: false,
      message: "Failed to resolve ticket",
    };
  }
}

export async function getDashboard() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;
    if (!token) {
      return {
        success: false,
        message: "Authentication token not found",
      };
    }
    const Category = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/dashboard",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const userData = await Category.json();
    if (userData?.error) {
      return {
        success: false,
        message: userData?.msg || "Failed to fetch dashboard",
      };
    }
  
    return {
      success: true,
      data: userData?.data,
    };
  } catch (error) {
    console.log("Login error:", error);
    return {
      success: false,
      message: "Failed to fetch dashboard",
    };
  }
}