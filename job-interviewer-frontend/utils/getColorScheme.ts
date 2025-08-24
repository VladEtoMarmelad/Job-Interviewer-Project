import { decodeJWT } from "./decodeJWT"

export const getColorScheme = (token: string|null, systemColorScheme: "light"|"dark"|null|undefined): "light"|"dark" => {
  if (systemColorScheme && token) {
    const JWTColorTheme = decodeJWT(token).colorScheme
    if (JWTColorTheme === "system") {
      return systemColorScheme
    } else {
      return JWTColorTheme
    }
  }
  return "dark"
}