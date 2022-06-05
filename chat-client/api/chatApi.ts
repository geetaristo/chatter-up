import axios from 'axios'

const baseRestHost = 'http://localhost:3001'

export async function validateUserAlias (userAlias: string) : Promise<boolean> {
  if (userAlias !== null && userAlias.length > 3) {
    const response = await axios.get(`${baseRestHost}/useralias/validate/${userAlias}`)

    const { aliasIsValid } = response.data as unknown as { aliasIsValid: boolean}
    return aliasIsValid
  }

  return false
}

export interface ServerStatsResponse {
  messageCount: number
  connectionCount: number
}

export async function serverStats () : Promise<ServerStatsResponse> {
  const response = await axios.get(`${baseRestHost}/server/stats`)
  return response.data
}
