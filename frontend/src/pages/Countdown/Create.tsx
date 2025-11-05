import { Button, Center, FormControl, FormErrorMessage, Heading, Input, VStack } from "@chakra-ui/react"
import { useNavigate } from "react-router";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useCallback } from "react";
import { internalRoutes } from "../../routes";

dayjs.extend(duration);

type CreateCountdownForm = {
    title: string;
    date: string;
};

export const CreateCountdownPage = () => {
    const navigate = useNavigate();

    const form = useForm<CreateCountdownForm>({
        defaultValues: {
            title: '',
            date: dayjs().format('YYYY-MM-DD'),
        },
    });
    const { control, handleSubmit, setError, formState: { errors } } = form;

    const validateDate = useCallback((value: string) => {
        const date = dayjs(value);

        if (!date.isValid()) return 'Invalid date';
        if (date.isBefore(dayjs())) return 'Date must be in the future';
        return true;
    }, []);

    const onSubmit = (data: CreateCountdownForm) => {
        const date = dayjs(data.date);
        if (!date.isValid()) {
            setError('date', { message: 'Invalid date' });
            return;
        }

        const title = data.title.slice(0, 20);

        navigate(internalRoutes.countdown.view(date.format('YYYY-MM-DD'), title));
    };

    return (
        <Center h="100dvh" w="100vw" py={4} px={{ base: 4, md: 0 }}>
            <VStack gap={5}>
                <Heading fontSize="24px" fontWeight="600">Create a countdown</Heading>
                <VStack
                    w={{ base: '350px', md: '400px' }}
                    gap={3}
                    bg="white"
                    boxShadow="0 4px 15px rgba(0, 0, 0, 0.35)"
                    borderRadius="lg"
                    p={4}
                >
                    <FormProvider {...form}>
                        <FormControl isRequired isInvalid={!!errors.date}>
                            <Controller
                                name="date"
                                control={control}
                                rules={{ required: true, validate: validateDate }}
                                render={({ field }) => (
                                    <Input {...field} placeholder="Date" type="date" />
                                )}
                            />
                            {errors.date && <FormErrorMessage>{errors.date.message}</FormErrorMessage>}
                        </FormControl>
                        <FormControl isInvalid={!!errors.title}>
                            <Controller
                                name="title"
                                control={control}
                                render={({ field }) => (
                                    <Input {...field} placeholder="Title" maxLength={20} />
                                )}
                            />
                        </FormControl>
                        <Button type="submit" w="100%" colorScheme="blue" onClick={handleSubmit(onSubmit)}>Create</Button>
                    </FormProvider>
                </VStack>
            </VStack>
        </Center>
    );
};
