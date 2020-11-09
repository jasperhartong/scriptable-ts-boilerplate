export const RequestWithTimeout = (url: string, timeoutSeconds = 5) => {
    const request = new Request(url)
    request.timeoutInterval = timeoutSeconds
    return request
}