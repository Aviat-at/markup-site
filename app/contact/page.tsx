import type { Metadata } from "next";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

export const metadata: Metadata = {
  title: "Contact",
  description: "Reach out for collaborations, sponsorships, and editorial inquiries.",
};

export default function ContactPage() {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 7 }}>
        <Card>
          <CardContent sx={{ p: 3.5 }}>
            <Stack spacing={2} component="form">
              <Typography variant="h4">Let’s connect</Typography>
              <Typography color="text.secondary">Have a question or collaboration idea? Send a message.</Typography>
              <TextField label="Name" fullWidth />
              <TextField label="Email" fullWidth />
              <TextField label="Subject" fullWidth />
              <TextField label="Message" fullWidth multiline minRows={5} />
              <Box>
                <Button variant="contained">Send message</Button>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, md: 5 }}>
        <Card sx={{ height: "100%" }}>
          <CardContent sx={{ p: 3.5 }}>
            <Stack spacing={2}>
              <Typography variant="h5">Contact details</Typography>
              <Typography color="text.secondary">hello@markupjournal.dev</Typography>
              <Typography color="text.secondary">Based in Colombo, serving teams globally.</Typography>
              <Typography color="text.secondary">Follow: X / LinkedIn / GitHub</Typography>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
