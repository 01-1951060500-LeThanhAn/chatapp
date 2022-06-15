import React from "react";
import Button from "@material-ui/core/Button";
const Buttons = ({ handleSigninWithGoogle, children }) => {
  return (
    <Button
      onClick={handleSigninWithGoogle}
      variant="contained"
      color="primary"
    >
      {children}
    </Button>
  );
};

export default Buttons;
