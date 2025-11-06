import { Button, Center, Flex, FormControl, FormErrorMessage, FormLabel, Heading, Input, Radio, RadioGroup, VStack } from "@chakra-ui/react";
import { useCallback } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";

type YoutubeEditorForm = {
    videoUrl: string;
    splitDurationUnit: 'seconds' | 'parts' | undefined;
    splitDuration: number;
};

export const YoutubeEditorPage = () => {
    const form = useForm<YoutubeEditorForm>({
        defaultValues: {
            videoUrl: '',
            splitDurationUnit: undefined,
            splitDuration: 0,
        },
    });
    const { control, watch, handleSubmit, formState: { errors } } = form;

    const splitDurationUnit = watch('splitDurationUnit');

    const validateUrl = useCallback((url: string) => {
        console.log(url);
        return true;
    }, []);

    const onSubmit = (data: YoutubeEditorForm) => {
        console.log(data);
    };

    return (
        <Center h="100dvh" w="100vw" py={4} px={{ base: 4, md: 0 }}>
            <VStack gap={5}>
                <Heading fontSize="24px" fontWeight="600">Youtube Editor</Heading>
                <VStack
                    w={{ base: '350px', md: '400px' }}
                    gap={3}
                    bg="white"
                    boxShadow="0 4px 15px rgba(0, 0, 0, 0.35)"
                    borderRadius="lg"
                    p={4}
                >
                    <FormProvider {...form}>
                        <FormControl isRequired isInvalid={!!errors.videoUrl}>
                            <FormLabel>URL</FormLabel>
                            <Controller
                                name="videoUrl"
                                control={control}
                                rules={{ required: true, validate: validateUrl }}
                                render={({ field }) => (
                                    <Input {...field} placeholder="URL" />
                                )}
                            />
                            {errors.videoUrl && <FormErrorMessage>{errors.videoUrl.message}</FormErrorMessage>}
                        </FormControl>
                        <FormControl isRequired isInvalid={!!errors.splitDurationUnit}>
                            <FormLabel>Split video</FormLabel>
                            <Controller
                                name="splitDurationUnit"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <RadioGroup
                                        {...field}
                                        value={field.value}
                                        onChange={field.onChange}
                                    >
                                        <Flex justifyContent="space-between">
                                            <Radio value="seconds">In seconds</Radio>
                                            <Radio isDisabled value="parts">In parts</Radio> {/* TODO: Implement parts */}
                                            <Radio value={undefined}>Do not split</Radio>
                                        </Flex>
                                    </RadioGroup>
                                )}
                            />
                            {errors.splitDurationUnit && <FormErrorMessage>{errors.splitDurationUnit.message}</FormErrorMessage>}
                        </FormControl>
                        {!!splitDurationUnit && (
                            <FormControl isRequired isInvalid={!!errors.splitDuration}>
                                <FormLabel>{splitDurationUnit === 'seconds' ? 'Parts duration (in seconds)' : 'Parts number'}</FormLabel>
                                <Controller
                                    name="splitDuration"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <Input {...field} type="number" placeholder="0123456" />
                                    )}
                                />
                                {errors.splitDuration && <FormErrorMessage>{errors.splitDuration.message}</FormErrorMessage>}
                            </FormControl>
                        )}
                        <Button type="submit" w="100%" colorScheme="blue" onClick={handleSubmit(onSubmit)}>Generate</Button>
                    </FormProvider>
                </VStack>
            </VStack>
        </Center>
    );
};
