import { useEffect, useRef, useState } from "react";
import { app } from "./firebase";
import {
  Box,
  Container,
  VStack,
  Button,
  HStack,
  Input,
} from "@chakra-ui/react";
import Message from "./components/Message";
import {
  onAuthStateChanged,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";


const db = getFirestore(app);

const auth = getAuth(app);

const loginHendler = () => {
  const provider = new GoogleAuthProvider();

  signInWithPopup(auth, provider);
};

const logoutHendler = () => signOut(auth);

function App() {
  const Qurey = query(collection(db, "Message"), orderBy("createAt", "asc"));

  const [user, setUser] = useState(false);
  const [message, setmessage] = useState("");
  const [Messages, setMessage] = useState([]);

  const divForScrool = useRef(null);

  const submitHendler = async (e) => {
    e.preventDefault();
    setmessage("");
    try {
      await addDoc(collection(db, "Message"), {
        text: message,
        uid: user.uid,
        uri: user.photoURL,
        createAt: serverTimestamp(),
      });
      divForScrool.current.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (data) => {
      setUser(data);
    });

    const unSubscribeMessage = onSnapshot(Qurey, (snap) => {
      setMessage(
        snap.docs.map((item) => {
          const id = item.id;
          return { id, ...item.data() };
        })
      );
    });

    return () => {
      unSubscribe();
      unSubscribeMessage();
    };
  }, []);

  return (
    <Box bg={"red.50"}>
      {user ? (
        <Container h={"100vh"} bg={"white"}>
          <VStack h={"full"} paddingX={"2"} paddingY={"4"}>
            <Button w={"full"} colorScheme="red" onClick={logoutHendler}>
              Log Out
            </Button>

            <VStack
              w={"full"}
              h={"full"}
              overflowY={"auto"}
              css={{"&::-webkit-scrollbar":{
                display:"none"
              }}}
            >
              {Messages.map((item) => (
                <Message
                  key={item.id}
                  text={item.text}
                  uri={item.uri}
                  user={item.uid === user.uid ? "me" : "other"}
                />
              ))}
              <div ref={divForScrool}></div>
            </VStack>

            <form onSubmit={submitHendler} style={{ width: "100%" }}>
              <HStack>
                <Input
                  value={message}
                  onChange={(e) => setmessage(e.target.value)}
                  placeholder="Enter a message.."
                />
                <Button colorScheme="purple" type="submit">
                  Send
                </Button>
              </HStack>
            </form>
          </VStack>
        </Container>
      ) : (
        <VStack bg={"white"} justifyContent={"center"} h={"100vh"}>
          <Button colorScheme={"purple"} onClick={loginHendler}>
            Sign In With Google
          </Button>
        </VStack>
      )}
    </Box>
  );
}

export default App;
