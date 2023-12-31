import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  styled,
  Typography,
  colors,
  Stack,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  CircularProgress,
  Button,
  Link,
  Divider,
} from '@mui/material';
import { signApi } from 'app/api/sign-api';
import { useSearchParams } from 'react-router-dom';

export function Verify() {
  const [searchParams] = useSearchParams();

  const token = searchParams.get('token') || '';

  const { data, isFetching } = signApi.useVerifyQuery(token);

  return isFetching ? (
    <CircularProgress sx={{ alignSelf: 'center' }} />
  ) : (
    <Stack
      spacing={4}
      component={Paper}
      elevation={5}
      sx={{
        px: 8,
        py: 2,
        alignItems: 'strech',
        alignSelf: 'center',
        maxWidth: '100%',
        height: '100%',
      }}
    >
      <Divider flexItem>
        <img style={{ width: '100%' }} src={'/images/isa-logo-wide.svg'} alt="ISA Logo" />{' '}
      </Divider>

      {data?.isVerified && (
        <Typography
          variant="body2"
          sx={{
            fontStyle: 'italic',
            color: 'text.secondary',
          }}
        >
          This document was digitally signed for <b>{data?.subject}</b> on <b>{data?.issuedAt}</b>{' '}
          and is valid until <b> {data?.expiresAt}</b>
        </Typography>
      )}

      <Typography
        variant="h5"
        sx={{
          fontStyle: 'bold',
          textAlign: 'center',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
        }}
      >
        {data?.content}
      </Typography>

      <Typography variant="body2" color={'text.secondary'} sx={{ fontStyle: 'italic' }}>
        * This verification page confirms that the document was issued by the International
        Slackline Association. <br /> It uses standard cryptography to prevent forgery.
      </Typography>
    </Stack>
  );
}
