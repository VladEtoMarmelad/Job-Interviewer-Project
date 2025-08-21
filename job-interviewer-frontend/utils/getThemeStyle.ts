export const getThemeStyle = (colorScheme: "light"|"dark", styles: any, styleName: string) => {
  const lightThemeStyleName = `lightTheme${styleName}`
  const darkThemeStyleName = `darkTheme${styleName}`

	const themeStyle = colorScheme === "light" ? styles[lightThemeStyleName] : styles[darkThemeStyleName]
	return themeStyle
}