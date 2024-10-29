import { cookies } from "next/headers";
import { Box } from "@mui/material";


const RouteGuard = ({children}: Readonly<{ children: React.ReactNode }>) => {

  const cookieStore = cookies();

  const authCheck = () => {
    return !!cookieStore.get('token');
  }

  return (
    <div>
      {!authCheck() && <Box>login</Box>}
      {children}
    </div>
  )



}

export default RouteGuard;