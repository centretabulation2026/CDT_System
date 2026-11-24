export interface PartyActivationEmailData {
  nomParti: string;
  sigle: string;
  dirigeantPrenom: string;
  dirigeantNom: string;
  email: string;
  activationUrl: string;
  licenceType?: string;
}

export function generatePartyActivationEmailHtml(data: PartyActivationEmailData): string {
  const { nomParti, sigle, dirigeantPrenom, dirigeantNom, activationUrl } = data;

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Activation de votre Espace Parti - CDT System</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #F1F5F9;
      color: #1E293B;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #F1F5F9;
      padding: 40px 15px;
    }
    .container {
      max-width: 580px;
      margin: 0 auto;
      background-color: #FFFFFF;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 11, 88, 0.08);
      border: 1px solid #E2E8F0;
    }
    .header {
      background-color: #FFFFFF;
      padding: 36px 28px 16px 28px;
      text-align: center;
      border-bottom: 1px solid #F1F5F9;
    }
    .header-badge {
      display: block;
      font-size: 11px;
      font-family: monospace;
      letter-spacing: 2.5px;
      text-transform: uppercase;
      font-weight: 700;
      margin-bottom: 8px;
      color: #64748B;
    }
    .header-title {
      font-size: 22px;
      font-weight: 800;
      letter-spacing: -0.5px;
      margin: 0;
      color: #0F172A;
    }
    .content {
      padding: 24px 28px 32px 28px;
    }
    .salutation {
      font-size: 15px;
      font-weight: 700;
      color: #0F172A;
      margin-bottom: 12px;
    }
    .paragraph {
      font-size: 13.5px;
      line-height: 1.6;
      color: #475569;
      margin-bottom: 20px;
    }
    .details-box {
      padding: 4px 0;
      margin-bottom: 24px;
    }
    .details-row {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      font-size: 12.5px;
      border-bottom: 1px dashed #E2E8F0;
    }
    .details-row:last-child {
      border-bottom: none;
    }
    .details-label {
      color: #64748B;
      font-weight: 500;
    }
    .details-value {
      color: #0F172A;
      font-weight: 700;
      text-align: right;
    }
    .cta-container {
      text-align: center;
      margin: 30px 0 24px 0;
    }
    .cta-button {
      display: inline-block;
      background-color: #000B58;
      color: #FFFFFF !important;
      text-decoration: none;
      font-size: 13.5px;
      font-weight: 700;
      padding: 14px 32px;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0, 11, 88, 0.25);
    }
    .cta-button:hover {
      background-color: #051147;
    }
    .link-fallback {
      font-size: 11px;
      color: #94A3B8;
      line-height: 1.5;
      word-break: break-all;
      margin-top: 18px;
      padding: 12px;
      background-color: #F8FAFC;
      border-radius: 8px;
    }
    .link-fallback a {
      color: #000B58;
      text-decoration: underline;
    }
    .footer {
      background-color: #F8FAFC;
      border-top: 1px solid #E2E8F0;
      padding: 20px;
      text-align: center;
      font-size: 11px;
      color: #94A3B8;
      line-height: 1.6;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <div class="header-badge">Centre de tabulation</div>
        <h1 class="header-title">Activation de votre Espace Parti</h1>
      </div>

      <div class="content">
        <div class="salutation">
          Bonjour ${dirigeantPrenom} ${dirigeantNom},
        </div>
        <p class="paragraph">
          La formation politique <strong>${nomParti} (${sigle})</strong> a été enregistrée avec succès sur la plateforme <strong>CDT System</strong>.
          Votre licence d'utilisation souveraine est désormais configurée.
        </p>

        <div class="details-box">
          <div class="details-row">
            <span class="details-label">Parti politique :</span>
            <span class="details-value">${nomParti} (${sigle})</span>
          </div>
          <div class="details-row">
            <span class="details-label">Représentant officiel :</span>
            <span class="details-value">${dirigeantPrenom} ${dirigeantNom}</span>
          </div>
          <div class="details-row">
            <span class="details-label">Statut du compte :</span>
            <span class="details-value" style="color: #D97706;">En attente de définition du mot de passe</span>
          </div>
        </div>

        <p class="paragraph">
          Pour finaliser l'activation de votre compte et accéder à votre console de gestion (membres, mandataires de terrain, collecte et procès-verbaux), veuillez définir votre mot de passe confidentiel :
        </p>

        <div class="cta-container">
          <a href="${activationUrl}" class="cta-button" target="_blank">
            Activer mon Espace Parti &rarr;
          </a>
        </div>

        <div class="link-fallback">
          Si le bouton ci-dessus ne fonctionne pas, copiez-collez l'adresse suivante dans votre navigateur :<br/>
          <a href="${activationUrl}">${activationUrl}</a>
        </div>
      </div>

      <div class="footer">
        &copy; 2026 CDT System • Système Centralisé de Gestion et Suivi Électoral.<br/>
        Plateforme souveraine d'intégrité et de centralisation électorale.
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}

export interface MandataireActivationEmailData {
  nomParti: string;
  prenom: string;
  nom: string;
  bureauAssigne: string;
  departement: string;
  ville: string;
  email: string;
  activationUrl: string;
}

export function generateMandataireActivationEmailHtml(data: MandataireActivationEmailData): string {
  const { nomParti, prenom, nom, bureauAssigne, departement, ville, email, activationUrl } = data;

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Activation de votre Espace Mandataire - CDT System</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #F1F5F9;
      color: #1E293B;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #F1F5F9;
      padding: 40px 15px;
    }
    .container {
      max-width: 580px;
      margin: 0 auto;
      background-color: #FFFFFF;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 11, 88, 0.08);
      border: 1px solid #E2E8F0;
    }
    .header {
      background-color: #FFFFFF;
      padding: 36px 28px 16px 28px;
      text-align: center;
      border-bottom: 1px solid #F1F5F9;
    }
    .header-badge {
      display: block;
      font-size: 11px;
      font-family: monospace;
      letter-spacing: 2.5px;
      text-transform: uppercase;
      font-weight: 700;
      margin-bottom: 8px;
      color: #64748B;
    }
    .header-title {
      font-size: 22px;
      font-weight: 800;
      letter-spacing: -0.5px;
      margin: 0;
      color: #0F172A;
    }
    .content {
      padding: 24px 28px 32px 28px;
    }
    .salutation {
      font-size: 15px;
      font-weight: 700;
      color: #0F172A;
      margin-bottom: 12px;
    }
    .paragraph {
      font-size: 13.5px;
      line-height: 1.6;
      color: #475569;
      margin-bottom: 20px;
    }
    .details-box {
      background-color: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 12px;
      padding: 16px 20px;
      margin-bottom: 24px;
    }
    .details-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 12.5px;
      border-bottom: 1px dashed #E2E8F0;
    }
    .details-row:last-child {
      border-bottom: none;
    }
    .details-label {
      color: #64748B;
      font-weight: 500;
    }
    .details-value {
      color: #0F172A;
      font-weight: 700;
      text-align: right;
    }
    .cta-container {
      text-align: center;
      margin: 30px 0 24px 0;
    }
    .cta-button {
      display: inline-block;
      background-color: #000B58;
      color: #FFFFFF !important;
      text-decoration: none;
      font-size: 13.5px;
      font-weight: 700;
      padding: 14px 32px;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0, 11, 88, 0.25);
    }
    .cta-button:hover {
      background-color: #051147;
    }
    .link-fallback {
      font-size: 11px;
      color: #94A3B8;
      line-height: 1.5;
      word-break: break-all;
      margin-top: 18px;
      padding: 12px;
      background-color: #F8FAFC;
      border-radius: 8px;
    }
    .link-fallback a {
      color: #000B58;
      text-decoration: underline;
    }
    .footer {
      background-color: #F8FAFC;
      border-top: 1px solid #E2E8F0;
      padding: 20px;
      text-align: center;
      font-size: 11px;
      color: #94A3B8;
      line-height: 1.6;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <div class="header-badge">Centre de tabulation • Espace Mandataire</div>
        <h1 class="header-title">Activation de votre Espace Mandataire</h1>
      </div>

      <div class="content">
        <div class="salutation">
          Bonjour ${prenom} ${nom},
        </div>
        <p class="paragraph">
          Vous avez été désigné(e) comme mandataire officiel pour la formation politique <strong>${nomParti}</strong>.
        </p>

        <div class="details-box">
          <div class="details-row">
            <span class="details-label">Bureau de vote assigné :</span>
            <span class="details-value">${bureauAssigne}</span>
          </div>
          <div class="details-row">
            <span class="details-label">Département / Commune :</span>
            <span class="details-value">${departement} — ${ville}</span>
          </div>
          <div class="details-row">
            <span class="details-label">Adresse e-mail :</span>
            <span class="details-value" style="font-family: monospace;">${email}</span>
          </div>
          <div class="details-row">
            <span class="details-label">Statut du compte :</span>
            <span class="details-value" style="color: #D97706;">En attente de définition du mot de passe</span>
          </div>
        </div>

        <p class="paragraph">
          Pour finaliser l'activation de votre compte et accéder à votre interface de terrain (saisie des résultats et procès-verbaux de vote), veuillez définir votre mot de passe confidentiel :
        </p>

        <div class="cta-container">
          <a href="${activationUrl}" class="cta-button" target="_blank">
            Définir mon mot de passe sécurisé &rarr;
          </a>
        </div>

        <div class="link-fallback">
          Si le bouton ci-dessus ne fonctionne pas, copiez-collez l'adresse suivante dans votre navigateur :<br/>
          <a href="${activationUrl}">${activationUrl}</a>
        </div>
      </div>

      <div class="footer">
        &copy; 2026 CDT System • Système Centralisé de Gestion et Suivi Électoral.<br/>
        Plateforme souveraine d'intégrité et de centralisation électorale.
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}

export interface MemberAccessEmailData {
  nomParti: string;
  membrePrenom: string;
  membreNom: string;
  role: string;
  email: string;
  password?: string;
  loginUrl: string;
}

export function generateMemberAccessEmailHtml(data: MemberAccessEmailData): string {
  const { nomParti, membrePrenom, membreNom, role, email, password, loginUrl } = data;

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vos accès à la plateforme - CDT System</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #F1F5F9;
      color: #1E293B;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #F1F5F9;
      padding: 40px 15px;
    }
    .container {
      max-width: 580px;
      margin: 0 auto;
      background-color: #FFFFFF;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 11, 88, 0.08);
      border: 1px solid #E2E8F0;
    }
    .header {
      background-color: #FFFFFF;
      padding: 36px 28px 16px 28px;
      text-align: center;
      border-bottom: 1px solid #F1F5F9;
    }
    .header-badge {
      display: block;
      font-size: 11px;
      font-family: monospace;
      letter-spacing: 2.5px;
      text-transform: uppercase;
      font-weight: 700;
      margin-bottom: 8px;
      color: #64748B;
    }
    .header-title {
      font-size: 22px;
      font-weight: 800;
      letter-spacing: -0.5px;
      margin: 0;
      color: #0F172A;
    }
    .content {
      padding: 24px 28px 32px 28px;
    }
    .salutation {
      font-size: 15px;
      font-weight: 700;
      color: #0F172A;
      margin-bottom: 12px;
    }
    .paragraph {
      font-size: 13.5px;
      line-height: 1.6;
      color: #475569;
      margin-bottom: 20px;
    }
    .credentials-box {
      background-color: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 12px;
      padding: 16px 20px;
      margin-bottom: 24px;
    }
    .details-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 12.5px;
      border-bottom: 1px dashed #E2E8F0;
    }
    .details-row:last-child {
      border-bottom: none;
    }
    .details-label {
      color: #64748B;
      font-weight: 500;
    }
    .details-value {
      color: #0F172A;
      font-weight: 700;
      font-family: monospace;
      text-align: right;
    }
    .cta-container {
      text-align: center;
      margin: 30px 0 24px 0;
    }
    .cta-button {
      display: inline-block;
      background-color: #000B58;
      color: #FFFFFF !important;
      text-decoration: none;
      font-size: 13.5px;
      font-weight: 700;
      padding: 14px 32px;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0, 11, 88, 0.25);
    }
    .cta-button:hover {
      background-color: #051147;
    }
    .link-fallback {
      font-size: 11px;
      color: #94A3B8;
      line-height: 1.5;
      word-break: break-all;
      margin-top: 18px;
      padding: 12px;
      background-color: #F8FAFC;
      border-radius: 8px;
    }
    .link-fallback a {
      color: #000B58;
      text-decoration: underline;
    }
    .footer {
      background-color: #F8FAFC;
      border-top: 1px solid #E2E8F0;
      padding: 20px;
      text-align: center;
      font-size: 11px;
      color: #94A3B8;
      line-height: 1.6;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <div class="header-badge">Centre de tabulation • Espace Parti</div>
        <h1 class="header-title">Vos accès à la plateforme</h1>
      </div>

      <div class="content">
        <div class="salutation">
          Bonjour ${membrePrenom} ${membreNom},
        </div>
        <p class="paragraph">
          Un compte d'accès officiel vous a été configuré sur la plateforme <strong>CDT System</strong> pour la formation politique <strong>${nomParti}</strong>.
        </p>

        <div class="credentials-box">
          <div class="details-row">
            <span class="details-label">Identifiant (E-mail) :</span>
            <span class="details-value">${email}</span>
          </div>
          ${password ? `
          <div class="details-row">
            <span class="details-label">Mot de passe temporaire :</span>
            <span class="details-value" style="color: #000B58;">${password}</span>
          </div>
          ` : ""}
          <div class="details-row">
            <span class="details-label">Rôle attribué :</span>
            <span class="details-value" style="font-family: inherit;">${role}</span>
          </div>
        </div>

        <p class="paragraph">
          Vous pouvez dès à présent vous connecter à votre console sécurisée pour accéder à votre espace de travail :
        </p>

        <div class="cta-container">
          <a href="${loginUrl}" class="cta-button" target="_blank">
            Se connecter à la plateforme &rarr;
          </a>
        </div>

        <div class="link-fallback">
          Lien direct de connexion :<br/>
          <a href="${loginUrl}">${loginUrl}</a>
        </div>
      </div>

      <div class="footer">
        &copy; 2026 CDT System • Système Centralisé de Gestion et Suivi Électoral.<br/>
        Plateforme souveraine d'intégrité et de centralisation électorale.
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}
