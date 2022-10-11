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
export default function Home() {
  const [elfc, setElfc] = useState(0);
  const [value, setValue] = useState(0);
  const [eValue, setEvalue] = useState();
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState();
  const [process, setProcess] = useState(0);
  const [invoiceId, setInvoiceId] = useState('')
  const [qrImage, setQrImage] = useState('')
  const [count, setCount] = useState(0)
  const [done, setDone] = useState(false)
  const changeElfc = ({ value }) => {
    setValue((value * elfc).toFixed(3));
  };
  const change = ({ value }) => {
    setEvalue((value / elfc).toFixed(3));
  };

  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyDsgXB1w7a8Cc-mP_1WuzcmQ0tBdNEJ1EA",
    authDomain: "chargewallet-115f4.firebaseapp.com",
    projectId: "chargewallet-115f4",
    storageBucket: "chargewallet-115f4.appspot.com",
    messagingSenderId: "538276493317",
    appId: "1:538276493317:web:c93e21a47e91221044446c",
    measurementId: "G-69DKRLXKD8",
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  const sendVerification = async () => {
    console.log(phone);
    const rec = new RecaptchaVerifier("recaptcha-container", {}, auth);
    rec.render();

    signInWithPhoneNumber(auth, `+976${phone}`, rec)
      .then(function (confirmationResult) {
        window.confirmationResult = confirmationResult;
      })
      .then((res) => setProcess(33));
  };

  const verify = () => {
    console.log(code);
    if (code !== undefined)
      if (code.length == 6) {
        confirmationResult
          .confirm(code)
          .then(async (res) => {
            console.log(res.user);
            if (res.user) {
              await axios.post("http://18.167.46.29:5002/payment/qpay", {
                sender_invoice_no: "1234567",
                invoice_description: address,
                amount: value,
                paymentMethodId: 1,
                userId: "hjasdfkhu23rj",
              }).then(async (response) => {
                
                let json = JSON.stringify(response.data.data)
                setInvoiceId(json.invoice_id)
                setProcess(66);
                setQrImage(json.qr_image)
                while(count < 10 || done == false) {
                  setTimeout(async () =>  {
                    await axios.post('http://18.167.46.29:5002/payment/qpay/check', {
                      invoiceId: invoiceId,
                      paymentMethodId: 1
                    }).then((r) => (r.data.status == 'pending') ? setCount(count++) : setDone(true))
                  }, 10000)
                }
                if(done == true) {
                  await axios.post('http://localhost:3001/v1/admin/chargeWallet', {
                    debitAddress: address,
                    amount: eValue,
                    description: "string"
                  }).then((rs) => {
                    setProcess(100)
                  })
                }
              });
              
            }
          })
          .catch((err) => console.log(err));
      }
  };
  const getData = async () => {
    let data = await axios.get("https://dev.elfchain.io/currency/prices");

    if (data.data.ELFC != undefined) {
      setElfc(data.data.ELFC);
    }
  };
  useEffect(() => {
    getData();
  }, [process]);
  return (
    <VStack h={"100vh"} justifyContent="center">
      {process == 0 && (
        <DefaultForm elfc={elfc} process={process}>
          <HStack gap={3}>
            <ChildrenInput
              dh={"20px"}
              lbl="You'll give"
              value={value}
              setValue={setValue}
              change={change}
              type="value"
            >
              {
                <Select border={"none"} p={0} sx={{ p: "0 !important" }}>
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
                <VStack pr={8}>
                  <Text color={"text.label"} fontWeight={500} fontSize={"18px"}>
                    ELFC
                  </Text>
                </VStack>
              }
            </ChildrenInput>
          </HStack>
          <Box h={4} />
          <DefaultInput lbl="Wallet address" fn={() => {}} />
          <Box h={4} />
          <DefaultInput
            lbl="Phone"
            value={phone}
            setValue={setPhone}
            fn={() => {}}
          />
          <Box h={4} />
          <div id="recaptcha-container" />
          <Box h={4} />

          <Checkbox
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
          </Checkbox>
          <Box h={4} />
          <Button
            variant={"unstyled"}
            w="full"
            bg={"bg.btn"}
            color="white"
            fontWeight={400}
            h={16}
            onClick={() => sendVerification()}
          >
            NEXT
          </Button>

          <Box h={10} />
        </DefaultForm>
      )}
      {process == 33 && (
        <DefaultForm elfc={elfc} process={process}>
          <VStack alignItems={"start"}>
            <Text fontSize={28}>Verify Your Phone</Text>
            <Box h={4} />
            <Text>We've sent a verification code to {phone}</Text>
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
      {qrImage != '' && (
        <DefaultForm elfc={elfc} process={process}>
          <VStack alignItems={"start"}>
            <Image src={qrImage} />
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
