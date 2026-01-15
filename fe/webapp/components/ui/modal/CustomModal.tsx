import BaseModal, { BaseModalProps } from "./BaseModal";

interface CustomModalProps extends BaseModalProps {}

const CustomModal = (props: CustomModalProps) => {
  return <BaseModal {...props}>{props.children}</BaseModal>;
};

export default CustomModal;
