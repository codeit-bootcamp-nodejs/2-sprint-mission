import dotenv from "dotenv";

dotenv.config();

const PORT = Number(process.env.PORT || 3000);
const JWT_ACCESS_TOKEN_SECRET =
  process.env.JWT_ACCESS_TOKEN_SECRET || "my-secret-access-token";
const JWT_REFRESH_TOKEN_SECRET =
  process.env.JWT_REFRESH_TOKEN_SECRET || "my-secret-refresh-token";


export {
  PORT,
  JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_SECRET,
};

