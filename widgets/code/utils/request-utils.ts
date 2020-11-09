export const RequestWithTimeout = (url: string, timeoutSeconds = 5) => {
    const request = new Request(url)
    // @ts-ignore
    request.timeoutInterval = timeoutSeconds
    return request
}