import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default [{ ignores: ["src/lib/api/types/**"] }, ...nextVitals, ...nextTs];
