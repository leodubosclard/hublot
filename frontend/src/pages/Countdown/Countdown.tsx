import { useEffect, useMemo, useState } from "react";
import { Box, Center, Heading, HStack, Text, VStack } from "@chakra-ui/react"
import { useSearchParams } from "react-router";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import confetti from "canvas-confetti";

dayjs.extend(duration);

const CONFETTI_DURATION = 1000;
const CONFETTI_INTERVAL = 100;

export const CountdownPage = () => {
    const [query] = useSearchParams();
    const [now, setNow] = useState(dayjs());

    const date = useMemo(() => {
        const stringDate = query.get('date');
        if (!stringDate?.match(/^\d{4}-\d{2}-\d{2}$/)) return null;
        const d = dayjs(stringDate, 'YYYY-MM-DD', true);
        return d.isValid() ? d : null;
    }, [query]);

    const dayDiff = useMemo(() => {
        if (!date) return 0;
        const diff = date.diff(now, 'day');
        return diff >= 1 ? diff : 0;
    }, [date, now]);

    const duration = useMemo(() => {
        if (!date) return '--:--:--';

        const diff = date.diff(now);
        if (diff <= 0) return '00:00:00';

        const dur = dayjs.duration(diff);
        const days = dur.days();
        const hours = String(dur.hours()).padStart(2, '0');
        const minutes = String(dur.minutes()).padStart(2, '0');
        const seconds = String(dur.seconds()).padStart(2, '0');

        return days >= 1
            ? `${String(days).padStart(2, '0')}:${hours}:${minutes}:${seconds}`
            : `${hours}:${minutes}:${seconds}`;
    }, [date, now]);

    const title = useMemo(() => (decodeURIComponent(query.get('title') ?? 'Countdown')).slice(0, 20), [query]);

    useEffect(() => {
        if (!date) return;

        const interval = setInterval(() => setNow(dayjs()), 1000);
        return () => clearInterval(interval);
    }, [date]);

    useEffect(() => {
        if (!date) return;
        if (date.diff(dayjs()) > 0) return;

        const end = Date.now() + CONFETTI_DURATION; // 1 second
        const interval = setInterval(() => {
            confetti({
                particleCount: 50,
                spread: 100,
                origin: { y: 0.6 },
            });

            if (Date.now() > end) clearInterval(interval);
        }, CONFETTI_INTERVAL);
        return () => clearInterval(interval);
    }, [date]);

    if (!date) return <Center h="100dvh" w="100vw"><Text>⚠ Invalid date</Text></Center>;

    return (
        <Center h="100dvh" w="100vw" py={4} px={{ base: 4, md: 0 }}>
            <VStack
                w={{ base: '350px', md: '400px' }}
                gap={3}
                bg="white"
                boxShadow="0 4px 15px rgba(0, 0, 0, 0.35)"
                borderRadius="24px"
            >
                <VStack w="100%" align="stretch" gap={3} p={4} pb={0}>
                    <HStack justify="space-between" align="center" lineHeight="1.2">
                        <Text fontSize="16px" fontWeight="400">{title}</Text>
                        <Text
                            fontSize="14px"
                            fontWeight="600"
                            p={1}
                            px={3}
                            bg="#e65471"
                            color="white"
                            borderRadius="2xl"
                            boxShadow="0 0 5px 0 #e65471"
                        >
                            {date.format('MMMM D')}
                        </Text>
                    </HStack>
                    <HStack justify="flex-start">
                        <Heading fontSize="36px" fontWeight="600">In {dayDiff} days</Heading>
                    </HStack>
                </VStack>
                <Box
                    w="100%"
                    bg="black"
                    borderRadius="24px"
                    p={5}
                    textAlign="center"
                    boxShadow="lg"
                    display="inline-block"
                >
                    <HStack w="100%" justify="center" spacing={3}>
                        {duration.split('').map((char, i) => (
                            <Text
                                key={i}
                                fontFamily="digital"
                                fontSize={{ base: '36px', md: '48px' }}
                                fontWeight="bold"
                                color={char === ':' ? 'gray.400' : 'white'}
                                letterSpacing="1px"
                            >
                                {char}
                            </Text>
                        ))}
                    </HStack>
                </Box>
            </VStack>
        </Center>
    );
};
