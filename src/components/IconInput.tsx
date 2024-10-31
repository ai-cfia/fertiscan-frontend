import { FormControl, Input, InputAdornment } from "@mui/material";

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
  return (
    <FormControl variant="standard">
      <Input
        id={id}
        placeholder={placeholder}
        type={type}
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
        startAdornment={
          <InputAdornment position="start">
            {icon}
          </InputAdornment>
        }
      ></Input>
    </FormControl>
  )
}

export default IconInput;