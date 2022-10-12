import {
  Divider,
  Box,
  FormControl,
  FormLabel,
  HStack,
  Text,
  VStack,
  Input,
  Image,
  NumberInput,
  NumberInputField,
  Select,
  Button,
  Checkbox,
  Link,
  Progress,
} from "@chakra-ui/react";

export const DefaultForm = ({
  elfc,
  value,
  children,
  setValue,
  change,
  phone,
  setPhone,
  sendVerification,
  setEvalue,
  changeElfc,
  eValue,
}) => {
  return (
    <FormControl
      maxW={"560px"}
      shadow="0px 2px 4px rgba(0, 0, 0, 0.1), 0px 1px 10px rgba(0, 0, 0, 0.06), 0px 4px 5px rgba(0, 0, 0, 0.07)"
      overflow="hidden"
    >
      <Progress value={process} size="xs" colorScheme="pink" />
      <FormLabel px={"40px"} py={"24px"}>
        <HStack justifyContent={"space-between"}>
          <Box w="80px">
            <Image src="https://tiny-ivory.vercel.app/assets/img/tiny-logo.svg" />
          </Box>
          <VStack alignItems={"start"}>
            <Text fontSize={20}>Buy crypto</Text>
            <Text color={"text.label"} fontSize={14}>
              {elfc} MNT = 1 ELFC
            </Text>
          </VStack>
        </HStack>
        <Divider my={25} />
        {children}
      </FormLabel>
    </FormControl>
  );
};

export const ChildrenInput = ({
  children,
  lbl,
  value,
  type,
  dh,
  setValue,
  changeElfc,
  change,
}) => {
  return (
    <HStack pl={3} py={2} bg={"bg.input"} borderRadius={12}>
      <VStack alignItems={"start"}>
        <Text color={"text.label"} fontSize={13} fontWeight={600}>
          {lbl}
        </Text>
        {type == "elfc" ? (
          <NumberInput
            variant={"unstyled"}
            value={value}
            sx={{ margin: "0 !important" }}
            onChange={(e) => {
              setValue(e),
              changeElfc({e});
            }}
          >
            <NumberInputField fontSize={20} pr={0} />
          </NumberInput>
        ) : (
          <NumberInput
            variant={"unstyled"}
            value={value}
            sx={{ margin: "0 !important" }}
            onChange={(e) => {
              setValue(e), change({e});
            }}
          >
            <NumberInputField fontSize={20} pr={0} />
          </NumberInput>
        )}
      </VStack>
      <Divider orientation="vertical" h={dh} bg="text.label" w="1px" />
      {children}
    </HStack>
  );
};

export const DefaultInput = ({ lbl, value, setValue, fn }) => {
  return (
    <Box bg={"bg.input"} borderRadius={12} pt={3} w="full">
      <FormControl variant="floating" id="first-name" isRequired>
        <Input
          placeholder=" "
          border="none"
          _focusVisible={{ border: "none" }}
          fontSize={14}
          value={value}
          onChange={(e) => {
            setValue(e.target.value),
            fn()
          }}
        />
        {/* It is important that the Label comes after the Control due to css selectors */}
        <FormLabel>{lbl}</FormLabel>
      </FormControl>
    </Box>
  );
};
