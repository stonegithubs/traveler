import request from './request'

export interface ResponseData {
  result_code: string | number
  result_message: string
}

export interface PassengerDTO {
  address: string
  born_date: string
  code: string
  country_code: string
  email: string
  first_letter: string
  index_id: string
  mobile_no: string
  passenger_flag: string
  passenger_id_no: string
  passenger_id_type_code: string
  passenger_id_type_name: string
  passenger_name: string
  passenger_type: string
  passenger_type_name: string
  phone_no: string
  postalcode: string
  recordCount: string
  sex_code: string
  sex_name: string
  total_times: string
}

export interface PassengerResponse {
  httpstatus: number
  status: boolean
  validateMessages: any
  validateMessagesShowId: string
  messages: any[]
  data: {
    dj_passengers: any[] | null
    exMsg: string
    isExist: boolean
    noLogin?: string
    normal_passengers: PassengerDTO[] | null
    other_isOpenClick?: string[]
    two_isOpenClick?: string[]
  }
}

const res = <T = any>(err: Error | null, data: T) => ({ err, data })

class Client {
  private static CAPTCHA_IMAGE = () => `/passport/captcha/captcha-image?login_site=E&module=login&rand=sjrand&${Math.random()}`
  private static CAPTCHA_CHECK = '/passport/captcha/captcha-check'
  private static LOGIN = '/passport/web/login'
  private static AUTH_UAMTK = '/passport/web/auth/uamtk'
  private static AUTH_CLIENT = '/otn/uamauthclient'
  private static LOGOUT = '/otn/login/loginOut'
  private static GET_PASSENGER = '/otn/confirmPassenger/getPassengerDTOs'

  private _user: {
    username: string,
    name: string
  } | null = null

  public getUser () {
    return this._user
  }

  public async captchaImage () {
    try {
      const { data } = await request<Buffer>({
        method: 'GET',
        encoding: null,
        url: Client.CAPTCHA_IMAGE()
      })
      return res(null, data)
    } catch (err) {
      return res(err, null)
    }
  }

  private _captchaCheck (answer: string) {
    return request<ResponseData>({
      method: 'POST',
      url: Client.CAPTCHA_CHECK,
      form: {
        answer,
        login_site: 'E',
        rand: 'sjrand'
      }
    })
  }

  private _login (username: string, password: string) {
    return request<{ uamtk?: string } & ResponseData>({
      method: 'POST',
      url: Client.LOGIN,
      form: {
        appid: 'otn',
        username,
        password
      }
    })
  }

  private _authUAMTK () {
    return request<{ apptk?: string | null; newapptk?: string } & ResponseData>({
      method: 'POST',
      url: Client.AUTH_UAMTK,
      form: {
        appid: 'otn'
      }
    })
  }

  private _authClient (tk: string) {
    return request<{ apptk?: string; username?: string } & ResponseData>({
      method: 'POST',
      url: Client.AUTH_CLIENT,
      form: {
        tk
      }
    })
  }

  public async auth () {
    try {
      const uamtkResult = (await this._authUAMTK()).data
      if (uamtkResult.result_code !== 0) {
        this._user = null
        return res(new Error(uamtkResult.result_message), null)
      }
      const authClientResult = (await this._authClient(uamtkResult.newapptk as string)).data
      if (authClientResult.result_code !== 0) {
        this._user = null
        return res(new Error(authClientResult.result_message), null)
      }
      return res(null, {
        apptk: authClientResult.apptk as string,
        username: authClientResult.username as string
      })
    } catch (err) {
      return res(err, null)
    }
  }

  public async verify (username: string, password: string, answer: string) {
    try {
      const checkResult = (await this._captchaCheck(answer)).data
      if (checkResult.result_code !== '4') return res(new Error(checkResult.result_message), null)
      const loginResult = (await this._login(username, password)).data
      if (loginResult.result_code !== 0) return res(new Error(loginResult.result_message), null)
      const authResult = await this.auth()
      if (authResult.data) {
        this._user = {
          username: username,
          name: authResult.data.username
        }
      }
      return authResult
    } catch (err) {
      return res(err, null)
    }
  }

  public logout () {
    return request({
      method: 'GET',
      url: Client.LOGOUT
    }).then(() => {
      this._user = null
      return this._authUAMTK()
    }).then(({ data }) => {
      if (data.result_code === 3) {
        return res(null, data)
      } else {
        return res(new Error(data.result_message), null)
      }
    }).catch(err => {
      return res(err, null)
    })
  }

  public async getPassenger (passengerName?: string) {
    try {
      const passengerResult = (await request<PassengerResponse>({
        method: 'POST',
        url: Client.GET_PASSENGER,
        form: {
          pageIndex: 1,
          pageSize: 999,
          'passengerDTO.passenger_name': passengerName
        }
      })).data
      if (!passengerResult.data.normal_passengers) {
        return res(new Error(passengerResult.data.exMsg), [])
      } else {
        return res(null, passengerResult.data.normal_passengers)
      }
    } catch (err) {
      return res(err, null)
    }
  }
}

export default Client