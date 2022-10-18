import {
  VStack,
  Container,
  Heading,
  HStack,
  Select,
  Text,
  Box,
  Checkbox,
  Link,
  Button,
  Input,
  Image,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { ChildrenInput, DefaultForm, DefaultInput } from "../src/utils/forms";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  signInWithPhoneNumber,
  RecaptchaVerifier,
} from "firebase/auth";
import { CheckIcon } from "@chakra-ui/icons";
import BeatLoader from "react-spinners/BeatLoader";
export default function Home() {
  const [elfc, setElfc] = useState(0);
  const [value, setValue] = useState(0);
  const [eValue, setEvalue] = useState();
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState();
  const [process, setProcess] = useState(0);
  const [invoiceId, setInvoiceId] = useState("");
  const [qrImage, setQrImage] = useState("");
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);
  const [alert, setAlert] = useState({value: '', address: '', phone: ''})
  const [isLoading, setIsLoading] = useState(false)
  const changeElfc = ({ e }) => {
    console.log(elfc, e);
    setValue((elfc * e).toFixed(3));
  };
  const change = ({ e }) => {

    setEvalue((e / elfc).toFixed(3));
  };

  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional


  // Initialize Firebase


  const sendVerification = async () => {
    console.log(phone);
    const rec = new RecaptchaVerifier("recaptcha-container", {}, auth);
    rec.render();

    signInWithPhoneNumber(auth, `+976${phone}`, rec)
      .then(function (confirmationResult) {
        window.confirmationResult = confirmationResult;
      })
      .then((res) => setProcess(50));
  };
  function getBase64Img(item) {
    return `data:image/png;base64,${item}`;
  }

  const verify = async () => {
    // console.log(code);
    // if (code !== undefined)
    //   if (code.length == 6) {
        // confirmationResult
        //   .confirm(code)
        //   .then(async (res) => {
          setIsLoading(true)
          if(value < 10) {
            setAlert((alert) => ({...alert, value: 'value must be greater than 10 ', address: '', phone:''}))
            setIsLoading(false)
            return 
          }
          if(address == '') {
            setAlert((alert) => ({...alert, address: 'address empty', value: '', phone: ''}))
            setIsLoading(false)
            return 
          }
          let phoneRegex = /^[0-9][0-9]{6}[0-9]$/g
          // if(!phone.match(phoneRegex) ) {
          //   setAlert((alert) => ({...alert, address: '', value: '', phone: 'invalid phonenumber'}))
          //   return
          // }
          
          setAlert((alert) => ({...alert, address: '', value: '', phone: ''}))

            if (parseFloat(value) > 9) {
              await axios.get(`https://tiny-admin.herokuapp.com/v1/wallet/tiny/${address}`).then((res) => {}).catch((err) => {
                if(err.response.data.statusCode == 400) {
                  setAlert((alert) => ({...alert, address: 'Address not found'}))
                  setIsLoading(false)
                  return
                }
              })
              await axios
                .post("http://18.167.46.29:5002/payment/qpay", {
                  sender_invoice_no: "1234567",
                  invoice_description: address == "" ? "string" : address,
                  amount: parseFloat(value),
                  paymentMethodId: 1,
                  userId: "hjasdfkhu23rj",
                })
                .then(async (response) => {
                  let json = JSON.parse(response.data.data);

                  setInvoiceId(json.invoice_id);
                  let base64img = getBase64Img(json.qr_image);

                  setQrImage(base64img);
                  setIsLoading(false)
                  setProcess(66);
                  
                })
                .catch((err) => {
                  console.log(err);
                });
            }
          // })
          // .catch((err) => console.log(err));
      // }
  };
  const chargeWallet = async () => {
    await axios
      .post("https://tiny-admin.herokuapp.com/v1/admin/chargeWallet", {
        debitAddress: address,
        amount: parseFloat(eValue),
        description: "string",
      })
      .then((rs) => {
        console.log(rs)
        setProcess(100);
      }).catch((err) => {console.log(err)});
  };
  const checkBill = async () => {
    await axios
      .post("http://18.167.46.29:5002/payment/qpay/check", {
        invoiceId: invoiceId,
        paymentMethodId: 1,
      })
      .then((r) =>
        r.data.status == "pending" ? console.log('unpaid'): chargeWallet()
      );
  };
  const getData = async () => {
    let data = await axios.get("https://dev.elfchain.io/currency/prices");

    if (data.data.ELFC != undefined) {
      setElfc(data.data.ELFC);
    }
    console.log(process)
  };
  useEffect(() => {
    getData();
  }, [process, isLoading]);
  return (
    <VStack h={"100vh"} justifyContent="center">
      {process == 0 && (
        <DefaultForm elfc={elfc} process={33} alert={alert.value}>
          <HStack gap={3} flexDir={['column', 'column', 'column','row']}>
            <ChildrenInput
              dh={"20px"}
              lbl="You'll give"
              value={value}
              setValue={setValue}
              change={change}
              type="value"
            >
              {
                <Select border={"none"} p={0} sx={{ p: "0 !important" }} w='80px'>
                  <option value="">MNT</option>
                </Select>
              }
            </ChildrenInput>
            <ChildrenInput
              dh={"20px"}
              lbl="You'll get"
              value={eValue}
              setValue={setEvalue}
              changeElfc={changeElfc}
              change={change}
              type="elfc"
            >
              {
                <VStack pr={[4,4,4, 8]} pl={[1,2,2, 8]}  >
                  <Text color={"text.label"} fontWeight={500} fontSize={"18px"} w={['64px', '64px', '64px', 'auto']}>
                    ELFC
                  </Text>
                </VStack>
              }
            </ChildrenInput>
          </HStack>
          <Box>{alert.value && <Text ml={4} mt={2} color='red.500'>{alert.value}</Text>}</Box>
          <Box h={4} />
          <DefaultInput lbl="Wallet address" fn={() => {}} setValue={setAddress} value={address}  alert={alert.address} />
          {/* <Box h={4} />
          <DefaultInput
            lbl="Phone"
            value={phone}
            setValue={setPhone}
            alert={alert.phone}
            fn={() => {}}
          /> */}
          <Box h={4} />
          {/* <div id="recaptcha-container" /> */}
          {/* <Box h={4} /> */}

          {/* <Checkbox
            spacing={4}
            fontSize={14}
            color="text.label"
            letterSpacing={"-0.05em"}
          >
            I agree to buy crypto and send it to the specified address
          </Checkbox>
          <Box h={2} />
          <Checkbox
            spacing={4}
            fontSize={14}
            color="text.label"
            letterSpacing={"-0.05em"}
          >
            I read and accept <Link>Terms if use</Link>
          </Checkbox> */}
          <Box h={4} />
          <Button
            variant={"unstyled"}
            textAlign='center'
            isLoading={isLoading}
            _hover={{bg: 'bg.btn'}}
            display='flex'
            justifyContent={'center'}
            spinner={isLoading ? <BeatLoader size={8} color='white' margin={'auto'} /> : false}
            loadingText={isLoading ? false : 'NEXT'}
            disabled={address == '' || value < 9}
            w="full"
            bg={"bg.btn"}
            color="white"
            fontWeight={400}
            h={16}
            onClick={() => verify()}
          >
            NEXT
          </Button>

          <Box h={10} />
        </DefaultForm>
      )}
      {process == 33 && (
        <DefaultForm elfc={elfc} process={66}>
          <VStack alignItems={"start"}>
            <Text fontSize={28}>Verify Your Phone</Text>
            <Box h={4} />
            <Text>We&#39;ve sent a verification code to {phone}</Text>
            <Box h={4} />

            <DefaultInput
              lbl="Authorization code"
              value={code}
              setValue={setCode}
              fn={verify}
            />
            <Box h={4} />
          </VStack>
        </DefaultForm>
      )}
      {qrImage != "" && process != 100 && (
        <DefaultForm elfc={elfc} process={99}>
          <VStack alignItems={"center"}>
            <Image src={qrImage} />
            <Button onClick={() => checkBill()}>Paid</Button>
          </VStack>
        </DefaultForm>
      )}
      {process == 100 && (
        <DefaultForm elfc={elfc} process={process}>
          <VStack>
            <Text fontSize={24} letterSpacing={"-0.05em"} lineHeight={1.1}>
              Transaction{" "}
            </Text>
            <Text
              fontSize={24}
              letterSpacing={"-0.05em"}
              sx={{ m: "0 !important" }}
              lineHeight={1.1}
            >
              Successful{" "}
            </Text>
            <Box h={4} />
            <CheckIcon color={"green"} fontSize={40} />
            <Box h={4} />
            <Text maxW={"200px"} textAlign="center">
              Please activate your ticket just before boarding.
            </Text>
          </VStack>
        </DefaultForm>
      )}
    </VStack>
  );
}
