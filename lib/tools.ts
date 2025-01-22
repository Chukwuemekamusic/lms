export const truncateUrl = (url: string, maxLength: number=30) => {
    if (url.length <= maxLength) return url
    return url.substring(0, maxLength) + "..."
}