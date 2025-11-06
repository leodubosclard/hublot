import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import type { FC, PropsWithChildren } from "react";

interface CustomModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
};

export const CustomModal: FC<PropsWithChildren<CustomModalProps>> = ({ isOpen, onClose, title, children }) => (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader>{title}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                {children}
            </ModalBody>
            <ModalFooter></ModalFooter>
        </ModalContent>
    </Modal>
);
