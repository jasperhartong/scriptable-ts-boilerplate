import { ErrorImage } from "code/components/images/ErrorImage";
import { RequestWithTimeout } from "code/utils/request-utils";

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
    const req = RequestWithTimeout(`https://source.unsplash.com/${id}/${width}x${height}`)
    try {
        return await req.loadImage();
    } catch (error) {
        return ErrorImage({ width, height, error })
    }
}

