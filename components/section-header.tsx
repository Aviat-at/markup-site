import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
};

export function SectionHeader({ eyebrow, title, subtitle }: Props) {
  return (
    <Stack spacing={1.2} mb={3}>
      {eyebrow ? (
        <Typography variant="overline" color="primary.main" fontWeight={700}>
          {eyebrow}
        </Typography>
      ) : null}
      <Typography variant="h4">{title}</Typography>
      {subtitle ? (
        <Typography color="text.secondary" sx={{ maxWidth: 700 }}>
          {subtitle}
        </Typography>
      ) : null}
    </Stack>
  );
}
