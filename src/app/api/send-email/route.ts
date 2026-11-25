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
    const { to, subject, html, partyData } = body as {
      to: string;
      subject?: string;
      html?: string;
      partyData?: PartyActivationEmailData;
    };

    if (!to) {
      return NextResponse.json(
        { success: false, error: "Adresse e-mail destinataire manquante." },
        { status: 400 }
      );
    }

    let htmlContent = html;
    if (!htmlContent && partyData && partyData.activationUrl) {
      htmlContent = generatePartyActivationEmailHtml(partyData);
    }

    if (!htmlContent) {
      return NextResponse.json(
        { success: false, error: "Contenu de l'e-mail ou données d'activation manquantes." },
        { status: 400 }
      );
    }

    const emailSubject =
      subject ||
      (partyData
        ? `Activation de votre Espace Parti - ${partyData.nomParti} (${partyData.sigle})`
        : "Notification officielle CDT System");

    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    let smtpAttempted = false;
    let smtpErrorMessage: string | null = null;

    // 1. MÉTHODE PRIORITAIRE : GMAIL SMTP (Sans restriction de domaine)
    if (smtpUser && smtpPass) {
      smtpAttempted = true;
      try {
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
          message: `E-mail envoyé avec succès à ${to} via ${smtpUser}.`,
        });
      } catch (err: any) {
        console.warn("Échec SMTP Gmail:", err.message);
        smtpErrorMessage = err.message || "Erreur de connexion SMTP";
      }
    }

    // 2. MÉTHODE SECONDAIRE / SECOURS : RESEND API
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey);
        const fromAddress = process.env.RESEND_FROM_EMAIL || "CDT System <onboarding@resend.dev>";

        const result = await resend.emails.send({
          from: fromAddress,
          to: [to],
          subject: emailSubject,
          html: htmlContent,
        });

        if (!result.error) {
          return NextResponse.json({
            success: true,
            id: result.data?.id,
            recipient: to,
            provider: "resend",
            message: `E-mail envoyé avec succès à ${to} via Resend.`,
          });
        }

        console.warn("Échec Resend API:", result.error);
        const resendMsg = result.error.message || "Erreur Resend";

        return NextResponse.json(
          {
            success: false,
            error: smtpAttempted
              ? `Échec SMTP (${smtpErrorMessage}) et échec Resend (${resendMsg})`
              : resendMsg,
            smtpError: smtpErrorMessage,
            resendError: resendMsg,
          },
          { status: 500 }
        );
      } catch (resendEx: any) {
        return NextResponse.json(
          {
            success: false,
            error: smtpAttempted
              ? `Échec SMTP (${smtpErrorMessage}) et exception Resend (${resendEx.message})`
              : resendEx.message,
          },
          { status: 500 }
        );
      }
    }

    // Si seulement SMTP a été tenté et a échoué
    if (smtpAttempted) {
      return NextResponse.json(
        {
          success: false,
          error: smtpErrorMessage || "Échec de connexion au serveur SMTP.",
          badCredentials:
            smtpErrorMessage?.includes("535-5.7.8") ||
            smtpErrorMessage?.includes("BadCredentials"),
        },
        { status: 500 }
      );
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
    console.error("Exception générale lors de l'envoi d'e-mail:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Erreur serveur inattendue lors de l'envoi du mail.",
      },
      { status: 500 }
    );
  }
}
