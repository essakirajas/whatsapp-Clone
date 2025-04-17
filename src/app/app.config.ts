import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideApollo } from 'apollo-angular';
import { ApolloClientOptions, ApolloLink, InMemoryCache } from '@apollo/client/core';
import { createUploadLink } from 'apollo-upload-client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';

import { routes } from './app.routes';
import { myUrl, wsUrl } from './graphql.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideApollo((): ApolloClientOptions<any> => {
      // ✅ WebSocket link for subscriptions
      const wsLink = new GraphQLWsLink(
        createClient({
          url: wsUrl,
          connectionParams: () => {
            const token = sessionStorage.getItem('token');
            return token ? { Authorization: `Bearer ${token}` } : {};
          },
          lazy: true, // ✅ Only connect when needed
          // reconnect: true, // ✅ Auto-reconnect on disconnect
        })
      );

      // // ✅ HTTP link for queries and mutations with file upload support
      const uploadLink = createUploadLink({
        uri: myUrl,
        credentials: 'include', // ✅ Allow sending cookies if required
      }) as unknown as ApolloLink;

      // ✅ Split traffic: Use WebSockets for subscriptions, HTTP for everything else
      const link = ApolloLink.split(
        ({ query }) => query.definitions.some(
          (def) => def.kind === 'OperationDefinition' && def.operation === 'subscription'
        ),
        wsLink, // Use WebSockets for subscriptions
        uploadLink // Use HTTP for queries/mutations
      );

      return {
        link,
        cache: new InMemoryCache(),
        connectToDevTools: true, // ✅ Enable Apollo DevTools
      };
    }),
  ],
};
