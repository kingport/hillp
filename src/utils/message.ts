import React from 'react'

export const MessageContext = React.createContext({
  messageNumber: { new_message: 0, pub_count: 0, ref_count: 0, sub_count: 0 },
})
export const UpdateMessageContext = React.createContext((val: any) => {
  //
})
