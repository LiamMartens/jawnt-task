"use client";

import { client } from "@/ts-rest";
import {
  Box,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  ButtonGroup,
} from "@mui/material";
import { useForm } from "react-hook-form";
import useSWR from "swr";

type FormValues = {
  reason: string;
  value: number;
};

export default function Requests() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      reason: "",
      value: 0,
    },
  });

  const { data, mutate, isLoading } = useSWR("/transactions", async () => {
    const response = await client.getTransactions();
    if (response.status === 200) return response.body;
    return [];
  });

  const handleApprove = async (uuid: string) => {
    await client.updateTransactionStatus({
      body: { uuid, status: "APPROVED" },
    });
    mutate();
  };

  const handleDeny = async (uuid: string) => {
    await client.updateTransactionStatus({
      body: { uuid, status: "DENIED" },
    });
    mutate();
  };

  return (
    <Box sx={{ mx: "auto", my: 4 }}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Reason</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Currency</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>{row.reason}</TableCell>
                <TableCell align="right">{row.amount_in_cents / 100}</TableCell>
                <TableCell align="right">{row.currency}</TableCell>
                <TableCell align="right">{row.status}</TableCell>
                <TableCell align="right">
                  <ButtonGroup variant="contained">
                    <Button
                      color="success"
                      disabled={isLoading}
                      onClick={() => handleApprove(row.id)}
                    >
                      Approve
                    </Button>
                    <Button
                      color="warning"
                      disabled={isLoading}
                      onClick={() => handleDeny(row.id)}
                    >
                      Deny
                    </Button>
                  </ButtonGroup>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
