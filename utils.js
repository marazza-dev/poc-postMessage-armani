import * as jose from '/node_modules/jose';

const secret = new TextEncoder().encode(import.meta.env.VITE_JWT_EXAMPLE_KEY);

const alg = 'HS256';

export async function createJWT(payload) {
  const jwt = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .sign(secret)

  return jwt
}
