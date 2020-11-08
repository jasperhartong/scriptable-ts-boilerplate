interface Props {
    id?: string;
    width?: number;
    height?: number;
}

export const UnsplashImage = async (
    {
        id = "random",
        width = 600,
        height = 600
    }: Props
) => {
    const req = new Request(`https://source.unsplash.com/${id}/${width}x${height}`)
    try {
        return await req.loadImage();
    } catch (error) {
        return new Image()
    }

}