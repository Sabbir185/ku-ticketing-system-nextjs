"use server";
import { cookies } from "next/headers";

export async function fetchCategory() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;
    if (!token) {
      return {
        success: false,
        message: "Authentication token not found",
      };
    }
    const Category = await fetch(process.env.NEXT_PUBLIC_API_URL + "/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const res = await Category.json();
    if (res?.error) {
      return {
        success: false,
        message: res?.msg || "Failed to fetch category",
      };
    }
    if (!res?.data) {
      return {
        success: false,
        message: "Category data not found",
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
      message: "Failed to fetch category",
    };
  }
}

export async function createCategory(formData: FormData) {
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
      process.env.NEXT_PUBLIC_API_URL + "/ticket/category",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.get("name") as string,
        }),
      }
    );
    const userData = await Category.json();
    if (userData?.error) {
      return {
        success: false,
        message: userData?.msg || "Failed to fetch user profile",
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
      message: "Failed to create category",
    };
  }
}
export async function updateCategory(formData: FormData) {
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
      process.env.NEXT_PUBLIC_API_URL + "/ticket/category",
      {
      method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: formData.get("id") ,
          name: formData.get("name") as string,
        }),
      }
    );
    console.log("🚀 ~ updateCategory ~ Category:", Category)
    const categoryData = await Category.json();
    if (categoryData?.error) {
      return {
        success: false,
        message: categoryData?.msg || "Failed to fetch category",
      };
    }
  
    return {
      success: true,
      data: categoryData?.data,
    };
  } catch (error) {
    console.log("Login error:", error);
    return {
      success: false,
      message: "Failed to update category",
    };
  }
}
export async function deleteCategory(formData: FormData) {
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
      process.env.NEXT_PUBLIC_API_URL + "/ticket/category",
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
    const categoryData = await Category.json();
    if (categoryData?.error) {
      return {
        success: false,
        message: categoryData?.msg || "Failed to fetch category",
      };
    }
  
    return {
      success: true,
      data: categoryData?.data,
    };
  } catch (error) {
    console.log("Login error:", error);
    return {
      success: false,
      message: "Failed to delete category",
    };
  }
}
