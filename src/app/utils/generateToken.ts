import jwt from "jsonwebtoken";
const generateToken = (
  payload: Record<string, unknown>,
  secret: jwt.Secret,
  expiresIn:  number
): string => {
  const token = jwt.sign(payload, secret, { expiresIn });

  return token;

};

export default generateToken;
