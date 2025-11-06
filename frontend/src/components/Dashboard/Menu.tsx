import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import type { FC } from "react";

export type DashboardMenuProps = {
    name: string;
    items: Array<{
        name: string;
        action: () => void;
    }>;
};

export const DashboardMenu: FC<DashboardMenuProps> = ({ name, items }) => (
    <Menu>
        <MenuButton
            m={1}
            p={1}
            px={2}
            borderRadius={6}
            _active={{ backgroundColor: 'gray.100' }}
        >
            {name}
        </MenuButton>
        <MenuList>
            {items.map((item, index) => (
                <MenuItem key={index} onClick={item.action}>{item.name}</MenuItem>
            ))}
        </MenuList>
    </Menu>
);
