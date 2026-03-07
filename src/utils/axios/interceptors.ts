import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { getCookie } from '../cookies'

export const requestInterceptor = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  const conf: InternalAxiosRequestConfig = config

  if (typeof window !== 'undefined') {
    const innerData =
      getCookie('innerData') || JSON.parse(sessionStorage.getItem('__telegram__initParams') as string).tgWebAppData

    if (innerData && conf.headers) {
      // conf.headers?.Authorization = innerData || ''
      conf.headers['x-innerData'] = innerData
    }
  }

  return conf
}

export const responseInterceptor = (response: AxiosResponse): AxiosResponse => {
  return response
}

export const requestInterceptorError = (error: AxiosError): Promise<AxiosError> => {
  return Promise.reject(error)
}
export const responseInterceptorError = (error: AxiosError): Promise<AxiosError> => {
  return Promise.reject(error)
}
