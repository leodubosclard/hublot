import { useEffect, useState } from "react"
import { Controller, FormProvider, useForm } from "react-hook-form";
import { appConstants } from "../../utils/environment";
import { Button, Center, FormControl, FormErrorMessage, FormLabel, Heading, HStack, Input, Select, Text, useToast, VStack } from "@chakra-ui/react";
import { Lang, langLabels } from "./types";

type SubtitlesForm = {
    from: Lang;
    to: Lang;
    file: File | null;
}

export const SubtitlesPage = () => {
    const toast = useToast();

    const [loading, setLoading] = useState(false);

    const form = useForm<SubtitlesForm>({
        defaultValues: {
            from: Lang.FR,
            to: Lang.EN,
            file: null,
        },
    });
    const { handleSubmit, control, watch, setValue, formState: { errors } } = form;

    const [file, from, to] = watch(['file', 'from', 'to']);

    const onSubmit = async (data: SubtitlesForm) => {
        if (!data.file) return;

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('file', data.file);
            formData.append('from', data.from);
            formData.append('to', data.to);

            const res = await fetch(`${appConstants.backendUrl}/subtitles`, {
                method: 'POST',
                body: formData,
            });

            const blob = await res.blob();
            const downloadUrl = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = downloadUrl;

            const fileName = `translated_to_${data.to}_${data.file.name}`;
            a.download = fileName;

            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            URL.revokeObjectURL(downloadUrl);

            toast({
                title: 'Success',
                description: 'Subtitles translated successfully',
                status: 'success',
            });
        } catch (error) {
            console.error(error);
            toast({
                title: 'Error',
                description: 'Failed to translate',
                status: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (from !== to) return;
        setValue('to', Object.values(Lang).find(lang => lang !== from) as Lang);
    }, [from, to, setValue])

    return (
        <Center h="100dvh" w="100vw" py={4} px={{ base: 4, md: 0 }}>
            <VStack gap={5}>
                <Heading fontSize="24px" fontWeight="600">Translate subtitles</Heading>
                <VStack
                    w={{ base: '350px', md: '400px' }}
                    gap={3}
                    bg="white"
                    boxShadow="0 4px 15px rgba(0, 0, 0, 0.35)"
                    borderRadius="lg"
                    p={4}
                >
                    <FormProvider {...form}>
                        <FormControl isRequired isInvalid={!!errors.file?.message}>
                            <FormLabel>Original subtitle file</FormLabel>
                            <Controller
                                name="file"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => <Input type="file" accept=".srt" onChange={(e) => field.onChange(e.target.files?.[0] || null)} />}
                            />
                            {errors.file?.message && <FormErrorMessage>{errors.file.message}</FormErrorMessage>}
                        </FormControl>
                        <FormControl isRequired isInvalid={!!errors.from?.message}>
                            <FormLabel>From</FormLabel>
                            <Controller
                                name="from"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        value={field.value}
                                        onChange={field.onChange}
                                    >
                                        {Object.values(Lang).map(lang => (
                                            <option key={lang} value={lang}>
                                                {langLabels[lang]}
                                            </option>
                                        ))}
                                    </Select>
                                )}
                            />
                            {errors.from?.message && <FormErrorMessage>{errors.from.message}</FormErrorMessage>}
                        </FormControl>
                        <FormControl isRequired isInvalid={!!errors.to?.message}>
                            <FormLabel>To</FormLabel>
                            <Controller
                                name="to"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        value={field.value}
                                        onChange={field.onChange}
                                    >
                                        {Object.values(Lang).map(lang => (
                                            <option key={lang} value={lang} disabled={lang === from}>
                                                {langLabels[lang]}
                                            </option>
                                        ))}
                                    </Select>
                                )}
                            />
                            {errors.to?.message && <FormErrorMessage>{errors.to.message}</FormErrorMessage>}
                        </FormControl>
                        <HStack justify="flex-start" align="start">
                            <Text fontSize="14px" color="red.500">*</Text>
                            <Text fontSize="14px" color="gray.500">Note: Translated subtitles file will be automatically downloaded</Text>
                        </HStack>
                        <Button type="submit" w="100%" colorScheme="blue" disabled={!file} onClick={handleSubmit(onSubmit)} isLoading={loading}>Translate</Button>
                    </FormProvider>
                </VStack>
            </VStack>
        </Center>
    );
}
