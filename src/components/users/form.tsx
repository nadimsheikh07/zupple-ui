"use client";

import PasswordInput from "@/components/form/password";
import axiosInstance from "@/utils/axiosInstance";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  Icon,
  IconButton,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { DialogProps, useNotifications } from "@toolpad/core";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { defaultValues, fetchUrl } from "./constant";
import { handleErrorMessage } from "@/utils/errorHandler";

// Validation schema
const validationSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup
    .string()
    .required("Email is required")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid Email Address"
    ),
  password: yup
    .string()
    .required("Password is required.")
    .matches(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
      "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character."
    ),
  status: yup.boolean().required("Status is required"),
});

interface FormProps extends DialogProps<undefined, string | null> {
  id: unknown;
}

export default function UserForm({ id, open, onClose }: FormProps) {
  const router = useRouter();
  const notifications = useNotifications();
  const {
    handleSubmit,
    reset,
    setValue,
    watch,
    register,
    formState: { errors },
  } = useForm<any>({
    resolver: yupResolver(validationSchema),
    defaultValues: defaultValues,
  });


  const onSubmit = async (data: any) => {
    let url = `${fetchUrl}/`;
    let method: "post" | "put" = "post";

    if (id != "new") {
      url = `${fetchUrl}/${id}`;
      method = "put";
    }

    try {
      const response = await axiosInstance.request({
        url,
        method,
        data,
      });

      if (response.status == 200 || response.status == 201) {
        notifications.show(response.data.message, {
          severity: "success",
          autoHideDuration: 3000,
        });
      }

      onClose("true");
    } catch (error: unknown) {
      const errorMessage = handleErrorMessage(error);
      notifications.show(errorMessage, {
        severity: "error",
        autoHideDuration: 3000,
      });
    }
  };

  const bindData = useCallback(
    async (id: unknown) => {
      try {
        const response = await axiosInstance.get(`${fetchUrl}/${id}`);
        reset(response.data);
      } catch (error: unknown) {
        const { response } = error as unknown as {
          response: { status: number };
        };
        if (response && response.status == 403) {
          router.push("/forbidden");
        }
      }
    },
    [router, reset]
  );

  useEffect(() => {
    if (id && id != "new") {
      bindData(id);
    }
  }, [id, bindData]);

  return (
    <Dialog fullWidth open={open} onClose={() => onClose(null)}>
      <DialogTitle>
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h5">
            {id != "new" ? "Update User" : "Create User"}
          </Typography>
          <IconButton onClick={() => onClose(null)}>
            <Icon>close</Icon>
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container mt={1} spacing={2}>

            <Grid size={{ xs: 12 }}>
              <TextField
                label="Name"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                  sx: {
                    color: "primary.main",
                  },
                }}
                error={!!errors.name}
                helperText={errors.name?.message}
                {...register("name")}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                label="Email"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                  sx: {
                    color: "primary.main",
                  },
                }}
                error={!!errors.email}
                helperText={errors.email?.message}
                {...register("email")}
              />
            </Grid>

            <Grid size={{ md: 12, sm: 12, xs: 12 }}>
              <PasswordInput
                fullWidth
                label="Password*"
                value={watch("password") || ""}
                setValue={(e) => setValue("password", e)}
                errors={errors}
              />
            </Grid>

          </Grid>

          <FormControlLabel
            control={
              <Switch
                {...register("status")}
                checked={watch("status")}
                onChange={(e) => setValue("status", e.target.checked)}
                color="primary"
              />
            }
            label={watch("status") ? "Active" : "Inactive"}
          />

          <Box marginTop={2} display="flex" justifyContent="space-between">
            <Button
              type="button"
              variant="contained"
              color="secondary"
              onClick={() => reset()}
            >
              Reset
            </Button>
            <Button type="submit" variant="contained" color="primary">
              {id != "new" ? "Update" : "Create"}
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
}
