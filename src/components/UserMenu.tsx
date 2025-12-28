import {
  Avatar,
  HStack,
  HoverCard,
  Icon,
  Link,
  Portal,
  Stack,
  Text,useAvatar, Button
} from "@chakra-ui/react"
import { authStateStore, selectSignOut } from "../store/projectStore"
export const Logout =({handleLogout}:{handleLogout:  () => Promise<void>}) =>{
  return (
    <HStack>
      <Button onClick={handleLogout} >Logout</Button>
    </HStack>
  )
}
"use client"
export const Dem = () => {
  const avatar = useAvatar()
  return (
    <Stack align="flex-start">
      <Avatar.RootProvider value={avatar}> 
      </Avatar.RootProvider> 
    </Stack>
  )
}
const AvatarComponent =()=>{
  return(
        <Avatar.Root colorPalette="red">
                  <Avatar.Fallback />            
        </Avatar.Root>
  )
}
import { LuChartLine } from "react-icons/lu"
export const UserMenu = ({ email }: { email: string }) => {
 const signOut = authStateStore(selectSignOut)
  const handleLogout=async()=>{ 
    try{
      await signOut()
    }catch(err){
      console.error(err)
    }
  }    
  return (
    <HoverCard.Root size="sm">
      <HoverCard.Trigger asChild>
        <Link href="#">
           <AvatarComponent/>    
        </Link>
      </HoverCard.Trigger>
      <Portal>
        <HoverCard.Positioner>
          <HoverCard.Content>
            <HoverCard.Arrow />
            <Stack gap="4" direction="row">
              <AvatarComponent/>
              <Stack gap="3">
                <Stack gap="1">
                  <Text textStyle="sm" fontWeight="semibold">
                    {email}
                  </Text>
                  <Logout handleLogout={handleLogout} />
                </Stack>
                <HStack color="fg.subtle">
                  <Icon size="sm">
                    <LuChartLine />
                  </Icon>             
                </HStack>
              </Stack>
            </Stack>
          </HoverCard.Content>
        </HoverCard.Positioner>
      </Portal>
    </HoverCard.Root>
  )
}
