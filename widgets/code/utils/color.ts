export const DynamicColor = ({ lightColor, darkColor }: { lightColor: Color, darkColor: Color }): Color =>
    Color.dynamic(lightColor, darkColor);

export const DefaultColor = () => DynamicColor({ lightColor: Color.white(), darkColor: Color.black() })