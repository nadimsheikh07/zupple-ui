"use client";

import { Box, Button, Container, Typography } from "@mui/material";
import Link from "next/link";

export default function Home() {
  return (
    <Container>
      <Box alignContent={"center"} sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Box>

          <Typography component="h1" variant="h1">Zupple</Typography>

          <Typography mt={2}>This is user management application</Typography>

          <Box mt={2}>
            <Button variant="outlined" LinkComponent={Link} href="/dashboard">Go to the Zupple Dashboard</Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
