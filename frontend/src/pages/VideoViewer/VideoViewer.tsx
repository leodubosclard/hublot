import { useRef, useState, useEffect, useMemo } from "react";
import {
  Box,
  Button,
  HStack,
  Heading,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { convertSrtToVtt } from "./utils";

export const VideoViewerPage = () => {
  const playerRef = useRef<HTMLVideoElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const subtitlesInputRef = useRef<HTMLInputElement>(null);
  const videoUrlRef = useRef<string | null>(null);
  const subtitlesUrlRef = useRef<string | null>(null);

  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [subtitlesUrl, setSubtitlesUrl] = useState<string | null>(null);

  const revokeSubtitlesUrl = () => {
    if (!subtitlesUrl) return;

    URL.revokeObjectURL(subtitlesUrl);
    setSubtitlesUrl(null);
  };

  const revokeVideoUrl = () => {
    if (!videoUrl) return;

    URL.revokeObjectURL(videoUrl);
    setVideoUrl(null);
  };

  const loadVideoFile = (file: File | undefined) => {
    if (!file) return;

    const newVideoUrl = URL.createObjectURL(file);

    revokeVideoUrl();
    revokeSubtitlesUrl();
    setVideoUrl(newVideoUrl);

    if (videoInputRef.current) videoInputRef.current.value = '';
  };

  const handleSubtitleFile = async (file: File | undefined) => {
    if (!file) return;

    const text = await file.text();
    const blob = new Blob([convertSrtToVtt(text)], { type: 'text/vtt' });

    const newSubtitlesUrl = URL.createObjectURL(blob);

    revokeSubtitlesUrl();
    setSubtitlesUrl(newSubtitlesUrl);

    if (subtitlesInputRef.current) subtitlesInputRef.current.value = '';
  };

  const videoPlayer = useMemo(() => (
    <video
      ref={playerRef}
      key={videoUrl || 'no-video'}
      controls
      style={{ width: "100%", borderRadius: "8px", background: "black" }}
      crossOrigin="anonymous"
    >
      {videoUrl && <source src={videoUrl} type="video/mp4" />}
      {subtitlesUrl && <track kind="subtitles" label="Subtitles" srcLang="fr" src={subtitlesUrl} default />}
      Your browser does not support the HTML5 video tag.
    </video>
  ), [videoUrl, subtitlesUrl]);

  useEffect(() => {
    return () => {
      if (videoUrlRef.current) URL.revokeObjectURL(videoUrlRef.current);
      if (subtitlesUrlRef.current) URL.revokeObjectURL(subtitlesUrlRef.current);
    };
  }, []);

  useEffect(() => {
    videoUrlRef.current = videoUrl;
  }, [videoUrl]);

  useEffect(() => {
    subtitlesUrlRef.current = subtitlesUrl;
  }, [subtitlesUrl]);

  useEffect(() => {
    if (playerRef.current && videoUrl)
      setTimeout(() => playerRef.current?.load(), 0);
  }, [videoUrl]);

  return (
    <Box p={6} maxW="1100px" mx="auto" minH="100dvh">
      <VStack align="start" spacing={6}>
        <HStack w="full" align="flex-end" justify="space-between" flexWrap="wrap">
          <Heading size="md">🎬 Video Viewer</Heading>
          <Text fontSize="sm" color="gray.400">
            Shortcuts: Space Play/Pause • ←/→ Seek • F Fullscreen
          </Text>
        </HStack>

        <HStack w="full" flexWrap="wrap" gap={4}>
          <Button as="label" colorScheme="blue" cursor="pointer">
            Load video
            <Input
              ref={videoInputRef}
              type="file"
              accept=".mp4,.mov,.avi,.mkv,.webm,.flv,.wmv,.mpg,.mpeg,.m4v,.m4p,.m4b,.m4r,.m4v,.m4p,.m4b,.m4r"
              display="none"
              onChange={(e) => loadVideoFile(e.target.files?.[0])}
            />
          </Button>

          <Button as="label" colorScheme="blue" cursor="pointer">
            Load subtitles
            <Input
              ref={subtitlesInputRef}
              type="file"
              accept=".srt,.vtt,text/vtt,text/srt"
              display="none"
              onChange={(e) => handleSubtitleFile(e.target.files?.[0])}
            />
          </Button>
        </HStack>

        {videoPlayer}

        <Text color="gray.500" fontSize="sm">
          💡 Tip: You can load a .srt file, it will be automatically converted to WebVTT.
        </Text>
      </VStack>
    </Box>
  );
};
