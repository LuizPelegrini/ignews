import { Client } from 'faunadb';

if(!process.env.FAUNADB_SECRET_KEY) {
  throw new Error('FAUNADB_SECRET_KEY env variable not found')
}

export const faunaClient = new Client({
  secret: process.env.FAUNADB_SECRET_KEY,
  domain: 'db.eu.fauna.com',
  scheme: 'https'
});