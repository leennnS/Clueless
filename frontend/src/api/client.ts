import axios from 'axios';

const resolveGraphqlEndpoint = () => {
  const metaEnv = (typeof import.meta !== 'undefined' && (import.meta as any).env) || undefined;
  if (metaEnv?.VITE_GRAPHQL_ENDPOINT) {
    return metaEnv.VITE_GRAPHQL_ENDPOINT as string;
  }
  if (typeof process !== 'undefined' && process.env?.VITE_GRAPHQL_ENDPOINT) {
    return process.env.VITE_GRAPHQL_ENDPOINT;
  }
  return 'http://localhost:3000/graphql';
};

const graphqlBaseUrl = resolveGraphqlEndpoint();

export const graphqlClient = axios.create({
  baseURL: graphqlBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const executeGraphQL = async <T>(query: string, variables?: Record<string, any>) => {
  const response = await graphqlClient.post<{ data: T; errors?: any }>(
    '',
    { query, variables },
    { withCredentials: true },
  );
  if ((response.data as any).errors) {
    throw new Error((response.data as any).errors?.[0]?.message || 'GraphQL request failed');
  }
  return response.data.data;
};

export const setAuthToken = (token: string | null) => {
  if (token) {
    graphqlClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete graphqlClient.defaults.headers.common.Authorization;
  }
};
