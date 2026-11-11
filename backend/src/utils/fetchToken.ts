import { API_BASE_URL, CLIENT_KEY, CLIENT_SECRET } from '@config';
import { HttpException } from '@exceptions/HttpException';
import { logger } from '@utils/logger';
import axios from 'axios';
import qs from 'qs';

export interface Token {
  access_token: string;
  expires_in: number;
}

export async function fetchApiToken(): Promise<Token> {
  const authString = Buffer.from(`${CLIENT_KEY}:${CLIENT_SECRET}`, 'utf-8').toString('base64');

  try {
    const { data } = await axios({
      timeout: 30000, // NOTE: milliseconds
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + authString,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: qs.stringify({ grant_type: 'client_credentials' }),
      url: `${API_BASE_URL}/token`,
    });

    if (!data) throw new HttpException(502, 'Bad Gateway');

    return data as Token;
  } catch (error) {
    logger.error(`Failed to fetch JWT access token: ${JSON.stringify(error)}`);
    throw new HttpException(502, 'Bad Gateway');
  }
}
