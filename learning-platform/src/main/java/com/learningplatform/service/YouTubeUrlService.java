package com.learningplatform.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.net.URI;
import java.util.regex.Pattern;

@Service
public class YouTubeUrlService {

    private static final Pattern VIDEO_ID_PATTERN =
            Pattern.compile("^[a-zA-Z0-9_-]{11}$");

    public String extractVideoId(String youtubeUrl) {

        try {
            URI uri = URI.create(youtubeUrl.trim());

            String scheme = uri.getScheme();
            String host = uri.getHost();

            if (scheme == null ||
                    !(scheme.equalsIgnoreCase("https") ||
                            scheme.equalsIgnoreCase("http")) ||
                    host == null) {

                throw invalidUrl();
            }

            String videoId = null;

            // Format: https://youtu.be/VIDEO_ID
            if (host.equalsIgnoreCase("youtu.be")) {

                videoId = uri.getPath().replace("/", "");

            }

            // Formats from youtube.com
            else if (
                    host.equalsIgnoreCase("youtube.com") ||
                            host.equalsIgnoreCase("www.youtube.com") ||
                            host.equalsIgnoreCase("m.youtube.com")
            ) {

                String path = uri.getPath();

                // Format: youtube.com/watch?v=VIDEO_ID
                if ("/watch".equals(path)) {

                    videoId = getQueryParameter(
                            uri.getQuery(),
                            "v"
                    );

                }

                // Format: youtube.com/embed/VIDEO_ID
                else if (path != null && path.startsWith("/embed/")) {

                    videoId = path.substring("/embed/".length());

                }

                // Format: youtube.com/shorts/VIDEO_ID
                else if (path != null && path.startsWith("/shorts/")) {

                    videoId = path.substring("/shorts/".length());
                }
            }

            if (videoId == null ||
                    !VIDEO_ID_PATTERN.matcher(videoId).matches()) {

                throw invalidUrl();
            }

            return videoId;

        } catch (IllegalArgumentException exception) {

            throw invalidUrl();
        }
    }

    private String getQueryParameter(String query, String parameter) {

        if (query == null) {
            return null;
        }

        for (String pair : query.split("&")) {

            String[] parts = pair.split("=", 2);

            if (parts.length == 2 &&
                    parts[0].equals(parameter)) {

                return parts[1];
            }
        }

        return null;
    }

    private ResponseStatusException invalidUrl() {

        return new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Please provide a valid YouTube video URL"
        );
    }
}