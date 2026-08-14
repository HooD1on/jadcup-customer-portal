import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { getShowcaseProducts } from './worker/index.js'

function liveCatalogueDevApi(): Plugin {
  return {
    name: 'jadcup-live-catalogue-dev-api',
    configureServer(server) {
      server.middlewares.use('/api/showcase-products', async (_request, response) => {
        const upstreamResponse = await getShowcaseProducts()
        response.statusCode = upstreamResponse.status
        upstreamResponse.headers.forEach((value, name) => response.setHeader(name, value))
        response.end(await upstreamResponse.text())
      })
    },
  }
}

export default defineConfig({
  plugins: [liveCatalogueDevApi(), react(), tailwindcss()],
})
