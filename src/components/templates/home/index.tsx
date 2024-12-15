import React, { FC, useEffect } from "react";
import Box from "@mui/material/Box";
import { ListManga } from "@components/molecules/home/list_manga";

export const HomeTemplate: FC = () => {

  return (
    <Box>
      <ListManga />
    </Box>
  );
};
