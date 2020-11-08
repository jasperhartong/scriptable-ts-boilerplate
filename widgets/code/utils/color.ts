export const DynamicColor = ({ lightColor, darkColor }: { lightColor: Color, darkColor: Color }): Color =>
    // @ts-ignore
    Color.dynamic(lightColor, darkColor);