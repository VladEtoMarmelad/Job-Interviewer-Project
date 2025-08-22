import { decodeJWT } from "./decodeJWT"

export const getColorScheme = (token: string|null, systemColorScheme: "light"|"dark"|null|undefined): "light"|"dark" => {
  console.log("token:", token)
  console.log("systemColorScheme:", systemColorScheme)
  if (systemColorScheme && token) {
    console.log("1 more")
    const JWTColorTheme = decodeJWT(token).colorScheme
    if (JWTColorTheme === "system") {
      return systemColorScheme
    } else {
      return JWTColorTheme
    }
  }
  return "dark"
}