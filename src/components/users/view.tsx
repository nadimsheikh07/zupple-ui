"use client";

import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import {
  Box,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Icon,
  IconButton,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { DialogProps } from "@toolpad/core";
import React, { useEffect, useState } from "react";
import { fetchUrl } from "./constant";
import axiosInstance from "@/utils/axiosInstance";
import { UserModel } from "@/types/user";

interface UserViewProps extends DialogProps<undefined, string | null> {
  id: unknown;
}

export default function UserView({ id, open, onClose }: UserViewProps) {
  const [data, setData] = useState<UserModel>();

  useEffect(() => {
    if (id) {
      if (id != "new") {
        bindData(id);
      }
    }
  }, [id]);

  const bindData = async (id: unknown) => {
    const response = await axiosInstance.get(`${fetchUrl}/${id}`);
    setData(response.data);
  };
  const listItemStyles = {
    "& .MuiListItemText-primary": { fontSize: "14px", fontWeight: 500 },
    "& .MuiListItemText-secondary": {
      color: "primary.main",
      fontWeight: 400,
      wordBreak: "break-word",
      fontSize: "13.5px",
    },
  };

  const usersData = data;

  const details = [
    { label: "Name", value: usersData?.name },
    { label: "Email", value: usersData?.email },
  ];

  const labelIconMap: Record<string, React.ReactNode> = {
    Name: <PersonIcon fontSize="small" />,
    Email: <EmailIcon fontSize="small" />,
  };

  const renderSection = (title: string, fields: string[]) => (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6">{title}</Typography>
        <Grid container spacing={2}>
          {fields.map((label) => {
            const item = details.find((d) => d.label === label);
            return (
              <Grid
                key={label}
                size={{
                  xs: 12,
                  sm: title === "Personal Information" ? 4 : 6,
                  md:
                    title === "Personal Information"
                      ? 3
                      : title === "Other Details"
                        ? 6
                        : 6,
                }}
              >
                <ListItem disableGutters>
                  <Stack direction="row" alignItems="center">
                    {labelIconMap[item?.label || ""] && (
                      <Box mr={1} mt={0.5}>
                        {labelIconMap[item?.label || ""]}
                      </Box>
                    )}
                    <ListItemText
                      primary={item?.label}
                      secondary={item?.value || "N/A"}
                      sx={listItemStyles}
                    />
                  </Stack>
                </ListItem>
              </Grid>
            );
          })}
        </Grid>
      </CardContent>
    </Card>
  );
  return (
    <Dialog open={open} onClose={() => onClose(null)} maxWidth="lg">
      <DialogTitle>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack direction="row" spacing={2} alignItems="center">

            <Stack>
              <Typography variant="h5">
                {usersData?.name || "User"}
              </Typography>
            </Stack>
          </Stack>
          <IconButton onClick={() => onClose(null)}>
            <Icon>close</Icon>
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3} mb={4}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 12, md: 12 }}>
              {renderSection("Contact Information", [
                "Name",
                "Email",
              ])}
            </Grid>
          </Grid>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
