"use server";
import { cookies } from "next/headers";

export async function profileAction() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;
    if (!token) {
      return {
        success: false,
        message: "Authentication token not found",
      };
    }
    const user = await fetch(process.env.NEXT_PUBLIC_API_URL + "/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const userData = await user.json();
    if (userData?.error) {
      return {
        success: false,
        message: userData?.msg || "Failed to fetch user profile",
      };
    }
    if (!userData?.data) {
      return {
        success: false,
        message: "User data not found",
      };
    }
    return {
      success: true,
      data: userData?.data,
    };
  } catch (error) {
    console.log("Login error:", error);
    return { success: false, message: "Login failed. Please try again." };
  }
}

export async function profileUpdate(formData: FormData) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;
    if (!token) {
      return {
        success: false,
        message: "Authentication token not found",
      };
    }
    const user = await fetch(process.env.NEXT_PUBLIC_API_URL + "/profile", {
    method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: formData.get("name") as string, phone: formData.get("phone") as string }),
    });
    console.log("🚀 ~ profileUpdate ~ user:", user)
    const userData = await user.json();
    if (userData?.error) {
      return {
        success: false,
        message: userData?.msg || "Failed to update user profile",
      };
    }
    return {
      success: true,
      message: "update successful",
      data: userData?.data,
    };
  } catch (error) {
    console.log("Update error:", error);
    return { success: false, message: "update failed. Please try again." };
  }
} 