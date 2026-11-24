import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { Resend } from "resend";
import { generatePartyActivationEmailHtml, PartyActivationEmailData } from "@/lib/emailTemplates";

export async function GET() {
  const isSmtpConfigured = Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);
  const isResendConfigured = Boolean(process.env.RESEND_API_KEY);

  return NextResponse.json({
    configured: isSmtpConfigured || isResendConfigured,
    provider: isSmtpConfigured ? "gmail_smtp" : isResendConfigured ? "resend" : "none",
    fromEmail: process.env.SMTP_USER || process.env.RESEND_FROM_EMAIL || "centretabulation@gmail.com",
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { to, subject, partyData } = body as {
      to: string;
      subject?: string;
      partyData: PartyActivationEmailData;
    };

    if (!to) {
      return NextResponse.json(
        { success: false, error: "Adresse e-mail destinataire manquante." },
        { status: 400 }
      );
    }

    if (!partyData || !partyData.activationUrl) {
      return NextResponse.json(
        { success: false, error: "Données d'activation ou URL manquantes." },
        { status: 400 }
      );
    }

    const emailSubject =
      subject ||
      `Activation de votre Espace Parti - ${partyData.nomParti} (${partyData.sigle})`;

    const htmlContent = generatePartyActivationEmailHtml(partyData);

    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    // 1. MÉTHODE PRIORITAIRE : GMAIL SMTP (Sans aucune restriction de domaine vers n'importe qui)
    if (smtpUser && smtpPass) {
      const cleanPass = smtpPass.replace(/\s+/g, ""); // Suppression des espaces du mot de passe d'application
      const port = Number(process.env.SMTP_PORT) || 465;

      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: port,
        secure: port === 465, // true pour port 465 SSL
        auth: {
          user: smtpUser,
          pass: cleanPass,
        },
      });

      const fromAddress =
        process.env.EMAIL_FROM || `"Centre de Tabulation" <${smtpUser}>`;

      const info = await transporter.sendMail({
        from: fromAddress,
        to: to,
        subject: emailSubject,
        html: htmlContent,
      });

      return NextResponse.json({
        success: true,
        id: info.messageId,
        recipient: to,
        provider: "gmail_smtp",
        message: `E-mail envoyé avec succès à ${to} via centretabulation@gmail.com.`,
      });
    }

    // 2. MÉTHODE SECONDAIRE : RESEND API
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      const resend = new Resend(resendApiKey);
      const fromAddress = process.env.RESEND_FROM_EMAIL || "CDT System <onboarding@resend.dev>";

      const result = await resend.emails.send({
        from: fromAddress,
        to: [to],
        subject: emailSubject,
        html: htmlContent,
      });

      if (result.error) {
        console.error("Erreur Resend API:", result.error);
        return NextResponse.json(
          {
            success: false,
            error: result.error.message || "Erreur lors de l'envoi de l'e-mail via Resend.",
          },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        id: result.data?.id,
        recipient: to,
        provider: "resend",
        message: `E-mail envoyé avec succès à ${to} via Resend.`,
      });
    }

    // Aucun service configuré
    return NextResponse.json(
      {
        success: false,
        error: "Aucun service d'e-mail configuré (SMTP ou Resend).",
        missingApiKey: true,
      },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Exception lors de l'envoi d'e-mail:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Erreur serveur inattendue lors de l'envoi du mail.",
      },
      { status: 500 }
    );
  }
}
