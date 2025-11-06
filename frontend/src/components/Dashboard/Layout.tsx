import { HStack, Flex, Box, Text, VStack, UnorderedList, ListItem } from "@chakra-ui/react";
import type { FC, PropsWithChildren } from "react";
import { DashboardMenu, type DashboardMenuProps } from "./Menu";

export type Information = {
    name: string;
    value: string | number | boolean | string[] | number[] | undefined | null;
};

export type DashboardLayoutProps = {
    menu: DashboardMenuProps[];
    informations: Information[];
    logs: string[];

    showLogs?: boolean;
    showInformations?: boolean;
};

export const DashboardLayout: FC<PropsWithChildren<DashboardLayoutProps>> = ({ menu, informations, logs, showLogs = true, showInformations = true, children }) => {
    return (
        <>
            <HStack py={1} borderBottomWidth={1}>
                {menu.map((item, index) => <DashboardMenu key={index} name={item.name} items={item.items} />)}
            </HStack>
            <Flex direction="row" width="100%" maxH="calc(100vh - 49px)">
                <Box flex="3" h="calc(100vh - 49px)">
                    <Flex direction="column" h="100%" w="100%">
                        <Box flex="3" p={2}>{children}</Box>
                        {showLogs && (
                            <Box flex="1" p={2} bgColor="#FBFBFB" borderTopWidth={1} h="200px">
                                <Text fontWeight="bold" pb={1}>Logs</Text>
                                <VStack align="left" gap={0} pb={2} fontSize="14px" overflowY="auto" h="calc(100% - 24px)">
                                    {logs.map((log, index) => (
                                        <Text key={`log-${index}`} pl={2}>{log}</Text>
                                    ))}
                                </VStack>
                            </Box>
                        )}
                    </Flex>
                </Box>
                {showInformations && (
                    <Box flex="1" p={4} borderLeftWidth={1} overflowY="scroll">
                        <Text fontWeight="bold">Simulation:</Text>
                        <UnorderedList>
                            {informations.map((info, index) => (
                                <Box key={`${info.name}-${index}`}>
                                    {Array.isArray(info.value) ? (
                                        <ListItem>
                                            {info.name}: <b>{info.value.length}</b>
                                            <UnorderedList key={`${info.name}-${index}`}>
                                                {info.value.map((value, index) => (
                                                    <ListItem key={`${info.name}-${index}-${value}`}>{value}</ListItem>
                                                ))}
                                            </UnorderedList>
                                        </ListItem>
                                    ) : (
                                        <ListItem key={`${info.name}-${index}`}>{info.name}: <b>{info.value ?? 'N/A'}</b></ListItem>
                                    )}
                                </Box>
                            ))}
                        </UnorderedList>
                    </Box>
                )}
            </Flex>
        </>
    );
};
