"use server";
import { cookies } from "next/headers";

export async function fetchEmployee() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;
    if (!token) {
      return {
        success: false,
        message: "Authentication token not found",
      };
    }
    const Employee = await fetch(process.env.NEXT_PUBLIC_API_URL + "/ticket/employee", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const res = await Employee.json();
    if (res?.error) {
      return {
        success: false,
        message: res?.msg || "Failed to fetch employee",
      };
    }
    if (!res?.data) {
      return {
        success: false,
        message: "Employee data not found",
      };
    }
    return {
      success: true,
      data: res?.data,
    };
  } catch (error) {
    console.log("Login error:", error);
    return {
      success: false,
      message: "Failed to fetch employee",
    };
  }
}

export async function createEmployee(formData: FormData) {
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
      process.env.NEXT_PUBLIC_API_URL + "/ticket/employee",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.get("name") as string,
          email : formData.get("email") as string,
          phone : formData.get("phone") as string,
          role : formData.get("role") as string,
          password : formData.get("password") as string,
          department : formData.get("department") as string
        }),
      }
    );
    const userData = await Category.json();
    if (userData?.error) {
      return {
        success: false,
        message: userData?.msg || "Failed to fetch employee",
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
      message: "Failed to create employee",
    };
  }
}
export async function deleteEmployee(id: number) {
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
      process.env.NEXT_PUBLIC_API_URL + `/ticket/employee/${id}`,
      {
        method: "DELETE",
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
        message: userData?.msg || "Failed to fetch employee",
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
      message: "Failed to delete employee",
    };
  }
}

export async function updateEmployee( formData: FormData) {
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
      process.env.NEXT_PUBLIC_API_URL + `/ticket/employee`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: formData.get("id") as string,
          name: formData.get("name") as string,
          email : formData.get("email") as string,
          phone : formData.get("phone") as string,
          role : formData.get("role") as string,
          password : formData.get("password") as string,
          department : formData.get("department") as string
        }),
      }
    );
    const userData = await Category.json();
    if (userData?.error) {
      return {
        success: false,
        message: userData?.msg || "Failed to fetch employee",
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
      message: "Failed to update employee",
    };
  }
} 
