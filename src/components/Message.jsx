import React from 'react'
import {HStack,Avatar,Text} from "@chakra-ui/react"

function Message({text,uri,user="other"}) {
  return (
    <HStack alignSelf={user==="me"?"self-end":"self-start"} borderRadius={"base"} bg={"gray.100"} paddingX={user=="me"?"4":"2"} paddingY={"1.5"}>
        {
          user=="other" && <Avatar src={uri}></Avatar>
        }
        <Text>{text}</Text>
        {
          user=="me" && <Avatar src={uri}></Avatar>
        }
    </HStack>
  )
}

export default Message