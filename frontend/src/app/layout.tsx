import { Roboto } from "next/font/google";
import CssBaseline from "@mui/material/CssBaseline";
import type { Metadata } from "next";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";

const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500", "700"] });

export const metadata: Metadata = {};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <CssBaseline />
      <body className={roboto.className}>
        <Box sx={{ display: "flex" }}>
          <Drawer
            variant="permanent"
            anchor="left"
            sx={{
              width: 200,
              flexShrink: 0,
              "& .MuiDrawer-paper": {
                width: 200,
                boxSizing: "border-box",
              },
            }}
          >
            <List>
              {["Requests", "Management"].map(
                (text, index) => (
                  <ListItem key={text} disablePadding>
                    <ListItemButton href={`/${text.toLowerCase()}`}>
                      <ListItemText primary={text} />
                    </ListItemButton>
                  </ListItem>
                )
              )}
            </List>
          </Drawer>
          <Box sx={{ mx: 'auto', width: '100%', maxWidth: 800, px: 2, }}>{children}</Box>
        </Box>
      </body>
    </html>
  );
}
