"use server";


export async function sendOtp(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const action = formData.get("action") as string;
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/auth/otp",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, action }),
        credentials: "include",
      }
    );
    const result = await response.json();
    console.log("🚀 ~ sendOtp ~ result:", result)

    if (result?.error) {
      return {
        success: false,
        message: result?.msg || "Login failed. Please try again.",
      };
    }

    if (result?.data) {
      return {
        success: true,
        message: "OTP sent successfully",
      };
    }


 
  } catch (error) {
    console.log("Login error:", error);
    return { success: false, message: "Login failed. Please try again." };
  }
}
