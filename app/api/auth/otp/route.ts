import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/resend";
// import { sendEmail } from "@/lib/resend";
import { generateOTP } from "@/utils/common";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, action } = body;
    if (!email || !email.includes("@") || !action) {
      return NextResponse.json(
        { status: 400, error: true, msg: "Valid email is required" },
        { status: 400 }
      );
    }
    const otp = generateOTP();
    // check user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: email.toLowerCase().trim() }],
      },
    })
    if (existingUser) {
      return NextResponse.json(
        {
          status: 400,
          error: true,
          msg: "User already exists",
        },
        { status: 400 }
      );
    }
    
    // Check if otp already exists for this email
    const existingOtp = await prisma.otp.findFirst({
      where: {
        email: email.toLowerCase().trim(),
      },
    })
    if(existingOtp){
      // check if otp is expired
      if(existingOtp.expiresAt < new Date()){
        await prisma.otp.deleteMany({
          where: {
            email: email.toLowerCase().trim(),
          },
        })
        // update otp
        existingOtp.otp = otp;
        existingOtp.expiresAt = new Date(Date.now() + 2 * 60 * 1000);
        await prisma.otp.create({
          data: existingOtp,
        });
      }else{
        return NextResponse.json(
          {
            status: 400,
            error: true,
            msg: "OTP already sent. Please wait for 2 minutes.",
          },
          { status: 400 }
        );
      }

      // 
    }else{
      await prisma.otp.create({
        data: {
          email: email.toLowerCase().trim(),
          otp,
          action,
        },
      });
    }
   
    const {  error } = await sendEmail({
      from: process.env.FROM_EMAIL!,
      to: [email],
      subject: "Ticket System - Your OTP Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Ticket Management System</h2>
          <p>Your One-Time Password (OTP) for verification is:</p>
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #2563eb; font-size: 32px; margin: 0; letter-spacing: 5px;">${otp}</h1>
          </div>
          <p style="color: #666;">This OTP will expire in 5 minutes.</p>
          <p style="color: #666;">If you didn't request this OTP, please ignore this email.</p>
        </div>
      `,
    });
    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { status: 500, error: true, msg: "Failed to send OTP email" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      {
        status: 200,
        error: false,
        msg: "OTP sent successfully",
        data: {
          email,
          otp,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("OTP API error:", error);
    return NextResponse.json(
      {
        status: 500,
        error: true,
        msg: "Failed to send email. Please try later.",
      },
      { status: 500 }
    );
  }
}
