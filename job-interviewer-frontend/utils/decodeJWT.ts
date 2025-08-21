interface DecodedPayload {
  sub: number;
  name: string;
  colorTheme: "light"|"dark"|"system";
} 

export const decodeJWT = (JWT: string): DecodedPayload => {
  const tokenParts = JWT.split(".");
  const encodedPayloadPart = tokenParts[1]
  const decodedPayloadPart = atob(encodedPayloadPart)
  const decodedPayloadPartJSON = JSON.parse(decodedPayloadPart)
  return decodedPayloadPartJSON
}