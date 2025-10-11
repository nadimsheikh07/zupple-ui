"use client";

import axiosInstance from "@/utils/axiosInstance";
import { handleErrorMessage } from "@/utils/errorHandler";
import { getFetcher } from "@/utils/fetcher";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Icon,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  useTheme,
} from "@mui/material";
import { DataGrid, GridColDef, GridSortModel } from "@mui/x-data-grid";
import { useDialogs, useNotifications } from "@toolpad/core";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import useSWR, { mutate } from "swr";
import { ActionsCell } from "./actionRow";
import { fetchUrl, updatePasswordUrl, viewUrl } from "./constant";
import UserForm from "./form";
import UpdateProfilePassword from "./update-password";
import UserView from "./view";

export default function UserList() {
  const router = useRouter();
  const notifications = useNotifications();
  const dialogs = useDialogs();
  const theme = useTheme();
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [searchText, setSearchText] = useState("");

  // Build query string for page, sort, search
  const params = useMemo(() => {
    const searchParams = new URLSearchParams();

    searchParams.append("page", (paginationModel.page + 1).toString());
    searchParams.append("limit", paginationModel.pageSize.toString());
    if (searchText) searchParams.append("search", searchText);
    if (sortModel[0]) {
      searchParams.append("sort", sortModel[0].field);
      searchParams.append("order", sortModel[0].sort ?? "");
    }
    return searchParams.toString();
  }, [paginationModel, sortModel, searchText]);

  const { data, error, isLoading } = useSWR(
    `${fetchUrl}?${params}`,
    getFetcher
  );

  // Redirect on 403
  useEffect(() => {
    if (error?.status === 403) router.push("/forbidden");
  }, [error, router]);

  // Delete handler
  const handleDelete = useCallback(
    async (id: string) => {
      const ok = await dialogs.confirm(
        "Are you sure you want to delete this?",
        {
          okText: "Yes",
          cancelText: "No",
        }
      );
      if (!ok) return;

      try {
        const res = await axiosInstance.delete(`${fetchUrl}/${id}`);
        mutate(`${fetchUrl}?${params}`, { revalidate: true });
        notifications.show(res.data.message, {
          severity: "success",
          autoHideDuration: 3000,
        });
      } catch (error: unknown) {
        const errorMessage = handleErrorMessage(error);
        notifications.show(errorMessage, {
          severity: "error",
          autoHideDuration: 3000,
        });
      }
    },
    [dialogs, notifications, params]
  );

  // Edit handler
  const handleEdit = useCallback(
    async (id: string) => {
      const result = await dialogs.open((props) => (
        <UserForm {...props} id={id} />
      ));
      if (result) mutate(`${fetchUrl}?${params}`, { revalidate: true });
    },
    [dialogs, params]
  );

  // Add handler
  const handleAdd = useCallback(async () => {
    const result = await dialogs.open((props) => (
      <UserForm {...props} id="new" />
    ));
    if (result) mutate(`${fetchUrl}?${params}`, { revalidate: true });
  }, [dialogs, params]);

  const handleView = useCallback(
    async (id: string) => {
      const result = await dialogs.open((props) => (
        <UserView {...props} id={id} />
      ));
      if (result) {
        mutate(`${viewUrl}?${params.toString()}`);
      }
    },
    [dialogs, params]
  );

  const handlePassword = useCallback(
    async (id: string) => {
      const result = await dialogs.open((props) => (
        <UpdateProfilePassword {...props} id={id} />
      ));
      if (result) {
        mutate(`${updatePasswordUrl}?${params.toString()}`);
      }
    },
    [dialogs, params]
  );

  // Column definitions
  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "actions",
        headerName: "Actions",
        type: "actions",
        width: 120,
        renderCell: (params) => {
          return (
            <ActionsCell
              row={params.row}
              handleEdit={handleEdit}
              handleView={handleView}
              handlePassword={handlePassword}
              handleDelete={handleDelete}
            />
          );
        },
      },
      { field: "name", headerName: "Name", width: 200 },
      { field: "email", headerName: "Email", width: 250 },
    ],
    [handleEdit, handleView, handlePassword, handleDelete]
  );

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <p>Error loading users.</p>
      </Box>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box>
          <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Grid
              size={{
                xs: 12,
                md: 6,
                sm: 6
              }}
            >
              <TextField
                placeholder="Search"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Icon>search</Icon>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  width: { xs: "100%", sm: "auto" },
                }}
              />
            </Grid>
            <Grid
              size={{
                xs: 12,
                md: 6,
                sm: 6
              }}
            >
              <Stack
                direction="row"
                spacing={1}
                justifyContent="flex-end"
                width="100%"
              >
                <IconButton
                  sx={{
                    backgroundColor: theme.palette.action.hover,
                    "&:hover": {
                      backgroundColor: theme.palette.action.selected,
                    },
                  }}
                  aria-label="edit"
                  color="secondary"
                  onClick={() => mutate(`${fetchUrl}?${params.toString()}`)}
                >
                  <Icon>refresh</Icon>
                </IconButton>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    textTransform: "none",
                    width: { xs: "100%", sm: "auto" },
                  }}
                  onClick={() => handleAdd()}
                  endIcon={<ChevronRightIcon fontSize="small" />}
                >
                  New User
                </Button>
              </Stack>
            </Grid>
          </Grid>
          <Card>
            <Box height={500}>
              <DataGrid
                rows={data?.data || []}
                columns={columns}
                rowCount={data?.total || 0}
                paginationMode="server"
                sortingMode="server"
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                onSortModelChange={setSortModel}
                getRowId={(row) => row._id}
              />
            </Box>
          </Card>
        </Box>
      </CardContent>
    </Card>
  );
}
