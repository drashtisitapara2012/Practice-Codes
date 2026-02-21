export default ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
  secrets: {
    encryptionKey: env('ENCRYPTION_KEY'),
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  },
  preview: {
    enabled: true,
    config: {
      allowedOrigins: ['http://localhost:3000'],
      async handler(uid, { documentId, locale, status }) {
        if (uid === 'api::article.article') {
          try {
            console.log(`[Preview Handler] Generating preview URL for documentId: ${documentId}, locale: ${locale}, status: ${status}`);

            // Fetch the document in the specific locale to get the correct slug
            const document = await strapi.documents(uid).findOne({
              documentId,
              locale
            });

            if (!document) {
              console.warn(`[Preview Handler] No document found for ID ${documentId} and locale ${locale}`);
              return null;
            }

            const slug = document.slug;
            const previewUrl = `http://localhost:3000/api/draft?slug=${slug}&secret=${process.env.DRAFT_SECRET || 'MY_SECRET_TOKEN'}&locale=${locale}`;

            console.log(`[Preview Handler] Generated preview URL: ${previewUrl}`);
            return previewUrl;
          } catch (error) {
            console.error('[Preview Handler] Error generating preview URL:', error);
            return null;
          }
        }
        return null;
      }
    },
  },
});
