export function addBaseToMe(url:string) {
    if (url.startsWith('/')) {
        return process.env.VUE_APP_MEDIA_URL + url.substr(1);
    }
    const reg = /https?\/\/[\w\-.]+\//;
    if (url.search(reg)) {
        return url;
    }

    return process.env.VUE_APP_MEDIA_URL + url;
}