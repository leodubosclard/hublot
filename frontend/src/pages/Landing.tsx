import { Button, Card, CardBody, CardFooter, Heading, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { useCallback, type FC } from "react";
import { useNavigate } from "react-router";
import { internalRoutes } from "../routes";

const NAVIGATION_ITEMS = [
    {
        title: '📚 World of Scans',
        description: 'World Of Scans application allows users to read their favorite manga for free',
        url: 'https://wos.leodubosclard.com',
    },
    {
        title: '🕰️ Countdown',
        description: 'Create a countdown to a specific date to share with your friends and family.',
        url: internalRoutes.countdown.create,
    },
    {
        title: '🎬 Subtitles',
        description: 'Translate your subtitles files (.srt) from one language to another.',
        url: internalRoutes.subtitles,
    },
    {
        title: '🎬 Video Viewer',
        description: 'View your video files with subtitles in a web browser.',
        url: internalRoutes.videoViewer,
    },
];

export const LandingPage = () => (
    <VStack w="100vw" p={{ base: 4, md: 8 }}>
        <Heading my={8}>Hublot</Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
            {NAVIGATION_ITEMS.map((item) => (
                <Item key={item.title} {...item} />
            ))}
            <Item title="🔜 Coming soon" description="More features are coming soon" url="" />
        </SimpleGrid>
    </VStack>
);

type ItemProps = {
    title: string;
    description: string;
    url: string;
};

const Item: FC<ItemProps> = ({ title, description, url }) => {
    const navigate = useNavigate();

    const handleView = useCallback(() => {
        if (url.startsWith('http')) window.location.href = url;
        else navigate(url);
    }, [navigate, url]);

    return (
        <Card maxW="350px" boxShadow="lg">
            <CardBody>
                <Text fontSize="lg" fontWeight="bold" mb={2}>{title}</Text>
                <Text fontSize="md">{description}</Text>
            </CardBody>
            <CardFooter>
                <Button w="100%" disabled={!url} colorScheme="blue" onClick={handleView}>
                    View
                </Button>
            </CardFooter>
        </Card>
    );
};
