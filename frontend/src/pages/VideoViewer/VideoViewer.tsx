import { useRef, useState, useEffect, useMemo, useCallback } from "react";
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

const VIDEO_EXTENSIONS = ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.flv', '.wmv', '.mpg', '.mpeg', '.m4v', '.m4p', '.m4b', '.m4r'];

export const VideoViewerPage = () => {
  const playerRef = useRef<HTMLVideoElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const subtitlesInputRef = useRef<HTMLInputElement>(null);
  const videoUrlRef = useRef<string | null>(null);
  const subtitlesUrlRef = useRef<string | null>(null);

  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [subtitlesUrl, setSubtitlesUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const revokeSubtitlesUrl = useCallback(() => {
    if (!subtitlesUrl) return;

    URL.revokeObjectURL(subtitlesUrl);
    setSubtitlesUrl(null);
  }, [subtitlesUrl]);

  const revokeVideoUrl = useCallback(() => {
    if (!videoUrl) return;

    URL.revokeObjectURL(videoUrl);
    setVideoUrl(null);
  }, [videoUrl]);

  const loadVideoFile = useCallback((file: File | undefined) => {
    if (!file) return;

    const newVideoUrl = URL.createObjectURL(file);

    revokeVideoUrl();
    revokeSubtitlesUrl();
    setVideoUrl(newVideoUrl);

    if (videoInputRef.current) videoInputRef.current.value = '';
  }, [revokeVideoUrl, revokeSubtitlesUrl]);

  const handleSubtitleFile = async (file: File | undefined) => {
    if (!file) return;

    const text = await file.text();
    const blob = new Blob([convertSrtToVtt(text)], { type: 'text/vtt' });

    const newSubtitlesUrl = URL.createObjectURL(blob);

    revokeSubtitlesUrl();
    setSubtitlesUrl(newSubtitlesUrl);

    if (subtitlesInputRef.current) subtitlesInputRef.current.value = '';
  };

  const isVideoFile = useCallback((file: File): boolean => {
    const fileName = file.name.toLowerCase();
    return VIDEO_EXTENSIONS.some((ext) => fileName.endsWith(ext)) || file.type.startsWith('video/');
  }, []);

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

  useEffect(() => {
    const handleDragOverGlobal = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    };

    const handleDragLeaveGlobal = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      // Only set dragging to false if we're leaving the window
      if (e.clientX === 0 && e.clientY === 0) setIsDragging(false);
    };

    const handleDropGlobal = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer?.files || []);
      const videoFile = files.find(file => isVideoFile(file));

      if (videoFile) loadVideoFile(videoFile);
    };

    document.addEventListener('dragover', handleDragOverGlobal);
    document.addEventListener('dragleave', handleDragLeaveGlobal);
    document.addEventListener('drop', handleDropGlobal);

    return () => {
      document.removeEventListener('dragover', handleDragOverGlobal);
      document.removeEventListener('dragleave', handleDragLeaveGlobal);
      document.removeEventListener('drop', handleDropGlobal);
    };
  }, [loadVideoFile, isVideoFile]);

  return (
    <>
      {isDragging && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          zIndex={9999}
          border="4px dashed"
          borderColor="blue.400"
          bg="blue.50"
          opacity={0.3}
          pointerEvents="none"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text fontSize="2xl" fontWeight="bold" color="blue.500">
            Drop your video file here
          </Text>
        </Box>
      )}
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
    </>
  );
};
