import FormData from "form-data";
import Mailgun from "mailgun.js";

const PASSWORD_RESET_TEMPLATE_NAME = "Password Reset Link";

function getMailgunConfig() {
  const apiKey = process.env.MAILGUN_API_KEY?.trim();
  const domain = process.env.MAILGUN_DOMAIN?.trim();

  if (!apiKey) {
    throw new Error("MAILGUN_API_KEY is not configured");
  }

  if (!domain) {
    throw new Error("MAILGUN_DOMAIN is not configured");
  }

  return { apiKey, domain };
}

export async function sendPasswordResetEmail({
  recipientEmail,
  resetPasswordLink,
}: {
  recipientEmail: string;
  resetPasswordLink: string;
}) {
  const { apiKey, domain } = getMailgunConfig();
  const mailgun = new Mailgun(FormData);
  const client = mailgun.client({
    username: "api",
    key: apiKey,
  });

  await client.messages.create(domain, {
    from: `Stillwaters <stillwater@${domain}>`,
    to: [recipientEmail],
    template: PASSWORD_RESET_TEMPLATE_NAME,
    "t:variables": {
      recipientEmail,
      resetPasswordLink,
    },
  });
}
