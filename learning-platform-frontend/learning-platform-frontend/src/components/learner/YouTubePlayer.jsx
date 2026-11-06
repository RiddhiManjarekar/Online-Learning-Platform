function YouTubePlayer({ videoId, title }) {

    if (!videoId) {
        return (
            <div className="flex aspect-video items-center justify-center rounded-xl bg-gray-900 text-white">
                Video is unavailable.
            </div>
        );
    }

    return (
        <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">

            <iframe
                className="h-full w-full"
                src={`https://www.youtube.com/embed/${encodeURIComponent(videoId)}`}
                title={title || 'Course lesson video'}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
            />

        </div>
    );
}

export default YouTubePlayer;