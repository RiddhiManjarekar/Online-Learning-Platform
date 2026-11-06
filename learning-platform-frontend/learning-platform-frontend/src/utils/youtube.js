
export function getYouTubeVideoId(url) {
    if (!url) {
        return null;
    }

    try {
        const parsedUrl = new URL(url.trim());

        const host = parsedUrl.hostname.toLowerCase();

        let videoId = null;

        if (host === 'youtu.be') {
            videoId = parsedUrl.pathname.slice(1);
        } else if (
            host === 'youtube.com' ||
            host === 'www.youtube.com' ||
            host === 'm.youtube.com'
        ) {
            if (parsedUrl.pathname === '/watch') {
                videoId = parsedUrl.searchParams.get('v');
            } else if (
                parsedUrl.pathname.startsWith('/embed/')
            ) {
                videoId = parsedUrl.pathname.split('/')[2];
            } else if (
                parsedUrl.pathname.startsWith('/shorts/')
            ) {
                videoId = parsedUrl.pathname.split('/')[2];
            }
        }

        return videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId)
            ? videoId
            : null;

    } catch {
        return null;
    }
}
