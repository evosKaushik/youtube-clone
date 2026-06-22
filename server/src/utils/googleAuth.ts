import { OAuth2Client } from "google-auth-library";

const clientId =
  process.env.GOOGLE_CLIENT_ID ||
  "761529584102-7i3mkijmuhktkvvgqjh4l7ki1uusea8k.apps.googleusercontent.com";

const client = new OAuth2Client({
  client_id: clientId,
});

export const verifyIdToken = async (idToken: string) => {
  try {
    const loginTicket = await client.verifyIdToken({
      idToken,
      audience: clientId,
    });
    const userData = loginTicket.getPayload();
    return userData;
  } catch (error) {
    console.log("Google token verification failed:", error);
    return null;
  }
};
