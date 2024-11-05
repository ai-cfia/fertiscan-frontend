import { FormControl, IconButton, Input, InputAdornment } from "@mui/material";
import React, { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface IconInputProps {
  id: string;
  icon: React.ReactNode;
  placeholder: string;
  type: string;
  value: string;
  setValue: (value: string) => void;
}

/**
 * IconInput Component
 *
 * This component renders an input field with an icon on the left side.
 */
const IconInput = ({
  id,
  icon,
  placeholder,
  type,
  value,
  setValue,
}: IconInputProps) => {
  const [hasFocus, setFocus] = useState(false);
  const [trueType, setTrueType] = useState(type);
  const [showPassword, setShowPassword] = useState(false)


  const handleClickShowPassword =(e:React.MouseEvent<HTMLElement>)=>{
    e.stopPropagation();
    e.preventDefault();
    setTrueType(!showPassword?"text":"password");
    setShowPassword(!showPassword);
    document.getElementById(id)!.focus();
  }
  
  const handleInputFocus = () => {
    setFocus(true);
    if(type=="password"){
      const adornment = document.getElementById(id+"-show_password");
      adornment!.style.display = "block";
    }

  }

  const handleInputBlur = (e:React.FocusEvent<HTMLElement>) => {
    console.log(e.currentTarget)
    console.log("aaaaa")
    if(type=="password"){
      const adornment = document.getElementById(id+"-show_password");
      if(adornment!.matches(':hover')){
        e.currentTarget!.focus();
        return;
      }
      adornment!.style.display = "none";
      setTrueType("password");
    }
    setFocus(false);


  }

  const showPasswordAdornment = type==="password" ?
    <InputAdornment id={id+"-show_password"} sx={{display:hasFocus?"block":"none"}} position="end">
      <IconButton
        aria-label={
          showPassword ? 'hide the password' : 'display the password'
        }
        onClick={handleClickShowPassword}
        edge="end"
      >
        {showPassword ? <VisibilityOff sx={{fontSize:"medium"}}/> : <Visibility sx={{fontSize:"medium"}}/>}
      </IconButton>
    </InputAdornment>
  :
    <></>

  return (
    <FormControl variant="standard">
      <Input
        id={id}
        placeholder={placeholder}
        type={trueType}
        sx={{
          color: 'white',
          backgroundColor: 'transparent',
          border:0,
          '::before': {
            borderBottom: '1px solid white'
          },
          '&:hover::before': {
            borderBottom: '2px solid white !important'
          }
        }}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        startAdornment={
          <InputAdornment position="start">
            {icon}
          </InputAdornment>
        }
        endAdornment={showPasswordAdornment}
        data-testid={"input"}
      ></Input>
    </FormControl>
  )
}

export default IconInput;