import dotenv from "dotenv";

dotenv.config();
interface IMainGet {
  method: string;
  token: string | null;
  url: string;
  body?: any;
}

interface IMainPost {
  method: string;
  token: string | null;
  url: string;
  body?: any;
  functionCenTOM?: string;
}

const BASE_URL_SALESFORCE = process.env.BASE_URL_SALESFORCE;
const APEX_REST_PATH = `${BASE_URL_SALESFORCE}apexrest/`;
const CENTOM_URL = `https://www.optecanalytics.com/api/`;

export const urls = {
  salesForce: APEX_REST_PATH,
  salesForceNoApexrest: BASE_URL_SALESFORCE as string,
  cenTOM: CENTOM_URL,
};
const STATUS = process.env.STATUS;

export default class SalesforceService {
  protected urls = urls;
  constructor() {
    this.mainGet = this.mainGet.bind(this);
    // this.getAccountSalesforceId = this.getAccountSalesforceId.bind(this);
    this.getWorkOrder = this.getWorkOrder.bind(this);
    this.postCase = this.postCase.bind(this);
    // this.getWorkOrderList = this.getWorkOrderList.bind(this);
    // this.getWorkOrderListV2 = this.getWorkOrderListV2.bind(this);
    // this.getCasesList = this.getCasesList.bind(this);
  }

  public mainGet = async (props: IMainGet) => {
    const { method, token, body, url } = props;

    try {
      const urlComplete = `${url}${method}`;
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await fetch(urlComplete, {
        method: "GET",
        headers,
        body: body ? JSON.stringify(body) : null,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(
        `Error in mainGet ${JSON.stringify({
          method,
          token,
          body,
          url,
        })}`,
        error
      );
    }
  };

  public mainPost = async (props: IMainPost) => {
    const { method, token, body, url, functionCenTOM } = props;
    const urlComplete = `${url}${method}`;
    const acceptHeaderValue = url === urls.cenTOM ? "application/json" : "";

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      Accept: acceptHeaderValue,
    };

    try {
      const response = await fetch(urlComplete, {
        method: "POST",
        headers,
        body: JSON.stringify(
          url === urls.cenTOM
            ? {
                _kind: "grid",
                meta: { ver: "3.0" },
                cols: [{ name: "expr" }],
                rows: [{ expr: functionCenTOM }],
              }
            : body
        ),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(
        `Error in mainPost ${JSON.stringify({
          method,
          token,
          body,
          url,
          functionCenTOM,
        })}`,
        error
      );
    }
  };

  public async getAccesTokenSalesforce(): Promise<any> {
    try {
      const {
        STATUS,
        BASE_URL_SALESFORCE_AUTH_TOKEN_PROD,
        SALESFORCE_USERNAME,
        SALESFORCE_PASSWORD,
        SALESFORCE_CLIENT_ID,
        SALESFORCE_CLIENT_SECRET,
      } = process.env;

      if (STATUS === "Development") {
        const response = await fetch(
          `${BASE_URL_SALESFORCE_AUTH_TOKEN_PROD}?grant_type=password&username=${SALESFORCE_USERNAME}&password=${SALESFORCE_PASSWORD}&client_id=${SALESFORCE_CLIENT_ID}&client_secret=${SALESFORCE_CLIENT_SECRET}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const json = await response.json();

        return {
          token: json.access_token,
        };
      }

      const details: any = {
        grant_type: "password",
        username: SALESFORCE_USERNAME,
        password: SALESFORCE_PASSWORD,
        client_id: SALESFORCE_CLIENT_ID,
        client_secret: SALESFORCE_CLIENT_SECRET,
      };

      const formBody = Object.keys(details)
        .map(
          (key: any) =>
            encodeURIComponent(key) + "=" + encodeURIComponent(details[key])
        )
        .join("&");
      if (typeof BASE_URL_SALESFORCE_AUTH_TOKEN_PROD === "undefined") {
        throw new Error("BASE_URL_SALESFORCE_AUTH_TOKEN_PROD is undefined");
      }

      const response = await fetch(BASE_URL_SALESFORCE_AUTH_TOKEN_PROD, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: formBody,
      });

      const json = await response.json();
      return {
        token: json.access_token,
        ...details,
      };
    } catch (error) {
      console.error("Error in getAccesTokenSalesforce: ", error);
    }
  }

  public async getEquipment(
    equiment_id: string,
    tokenSalesforce: any
  ): Promise<any> {
    let json;
    json = await this.mainGet({
      method: `v2/equipment?equipmentId=${equiment_id}`,
      url: urls.salesForce,
      token: tokenSalesforce,
    });

    return JSON.parse(json)[0];
  }

  // ...rest of your methods

  public async getWorkOrder(tokenSalesforce: any): Promise<any> {
    try {
      let json = await this.mainGet({
        method:
          "workorders/mobile?customerId=001DP00001qgHggYAE&status=Completed",
        url: urls.salesForce,
        token: tokenSalesforce,
      });

      return json;
    } catch (error) {
      console.error("Error in getWorkOrder", error);
    }
  }

  public async postCase(body: any, tokenSalesforce: any): Promise<any> {
    try {
      let json = await this.mainPost({
        method: `createWorkOrder/Mobile`,
        url: urls.salesForce,
        token: tokenSalesforce,
        body: body,
      });

      return JSON.parse(json);
    } catch (error) {
      console.error("Error in postCase", error);
      return error;
    }
  }
}
