export const internalRoutes = {
    landing: '/',
    countdown: {
        view: (date: string, title?: string) => `/countdown?date=${date}${title ? `&title=${encodeURIComponent(title)}` : ''}`,
        create: '/countdown/create',
    },
    subtitles: '/subtitles',
};
