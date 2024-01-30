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

  const { data, mutate } = useSWR("/transactions", async () => {
    const response = await client.getTransactions();
    if (response.status === 200) return response.body;
    return [];
  });

  const handleSuccess = async (values: FormValues) => {
    const response = await client.submitTransaction({
      body: {
        currency: "USD",
        amount_in_cents: values.value * 100,
        reason: values.reason,
      },
    });
    console.log(response);
    if (response.status === 200) {
      const existing = data ?? [];
      mutate(existing.concat([response.body]));
    }
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Divider orientation="horizontal" sx={{ my: 4 }} />

      <form onSubmit={handleSubmit(handleSuccess)}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 2,
            gridAutoRows: "max-content",
            gridAutoFlow: "row",
          }}
        >
          <TextField
            id="reason"
            label="Reason"
            variant="standard"
            required
            {...register("reason", { required: true })}
          />
          <TextField
            id="value"
            label="Value (in USD)"
            variant="standard"
            type="number"
            min={0}
            required
            inputProps={{
              step: "0.01",
            }}
            {...register("value", { required: true })}
          />
          <Button type="submit" disabled={isSubmitting}>
            Submit
          </Button>
        </Box>
      </form>
    </Box>
  );
}
