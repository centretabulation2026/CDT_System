import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function GET() {
  const candidateUsers = [
    process.env.SMTP_USER || "centretabulation@gmail.com",
    "centretabulation2026@gmail.com",
    "pitonrodjy@gmail.com",
    "worksysmanagement@gmail.com",
  ];

  const pass = (process.env.SMTP_PASS || "hots xnlx elaj yaia").replace(/\s+/g, "");

  const results: any[] = [];

  for (const user of candidateUsers) {
    try {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: user,
          pass: pass,
        },
      });

      await transporter.verify();
      results.push({ user, success: true, message: "Identifiants acceptés par Google !" });
    } catch (err: any) {
      results.push({ user, success: false, error: err.message });
    }
  }

  return NextResponse.json({
    testedPassLength: pass.length,
    results,
  });
}
