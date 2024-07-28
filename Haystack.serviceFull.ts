type EquipmentId = {
  _kind: string;
  val: string;
  dis: string;
};
type Rooms =
  | {
      roomDate: string[];
      roomReason: string[];
      roomNumbers: string[];
      message: string;
      requestStatus: string;
    }
  | undefined;
type Equipment = {
  name: string;
  description: string;
  duration: string;
  equipment: string;
  equipmentArea: string;
  equipmentId: EquipmentId;
  equipmentMake: string;
  equipmentModel: string;
  equipmentSalesforceId: string;
  equipmentServiceFusionId: number;
  equipmentSpaceCategory: string;
  field1: string;
  field1Id: string;
  issue: string;
  issueId: string;
  navName: string;
  percentRuntime: string;
  sfAccountSalesforceID: string;
  sfCaseCategory: string;
  sfCaseOrigin: string;
  sfCaseRecordType: string;
  sfCaseStatus: string;
  sfEquipmentName: string;
  siteId: string;
  systemName: string;
  text: string;
  value1: string;
};

interface Point {
  id: {
    _kind: string;
    val: string;
    dis: string;
  };
  curVal: string;
  displayColor: string;
  equipment: string;
  navName: string;
  subText: string;
}
interface Category {
  category: string;
  points: Point[][];
}
export default class HaystackService {
  private readonly baseUrl: string = "https://www.optecanalytics.com/api";
  public async getToken(u: string, p: string): Promise<any> {
    const url = "http://localhost:3000/signin";
    let resp: any;
    const headers = new Headers({
      "Content-Type": "application/x-www-form-urlencoded",
    });

    const body = new URLSearchParams();
    body.append("u", u);
    body.append("p", p);

    resp = await fetch(url, {
      method: "POST",
      // mode: "no-cors",
      headers: headers,
      body: body,
    })
      .then((response) => {
        // if (!response.ok) {
        //   throw new Error("Network response was not ok " + response.statusText);
        // }
        console.log("response: ", response);
        return response.text(); // or response.json() if the response is JSON
      })
      .then((data) => {
        console.log("data: ", data);
        return data;
      })
      .catch((error) => {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      });
    console.log("resp: ", resp);
    return resp;
  }
  public getNewDate = (numberDays: any) => {
    const today = new Date();

    const dateToday = JSON.stringify(today).split("T")[0].replace('"', "");
    const arrayDate = dateToday.split("-");
    const currentDay = parseInt(arrayDate[2]);
    let currentMonth: any = parseInt(arrayDate[1]);
    let currentYear = parseInt(arrayDate[0]);
    let newDay: any;
    let newMonth: any;

    // si es el primer día del mes
    if (currentDay === 1) {
      if (currentMonth === 1) {
        currentYear = currentYear - 1;
      }
      // si el mes es 2 tiene 28 dias
      if (currentMonth === 3) {
        const numberDay = numberDays - 1;
        newDay = 28 - numberDay;
        newMonth = currentMonth - 1;
        return `${currentYear}-${newMonth}-${newDay}`;
      }

      // si el mes es impar tiene 31 dias
      if (currentMonth % 2 === 0) {
        const numberDay = numberDays - 1;
        newDay = 31 - numberDay;
        newMonth = currentMonth > 1 ? currentMonth - 1 : 12;
        return `${currentYear}-${newMonth}-${newDay}`;
      }

      // si el mes par tiene 30 dias
      if (currentMonth % 2 === 1) {
        const numberDay = numberDays - 1;
        newDay = 30 - numberDay;
        newMonth = currentMonth > 1 ? currentMonth - 1 : 12;
        return `${currentYear}-${newMonth}-${newDay}`;
      }
    }

    if (currentDay === 2) {
      // si el mes es 2 tiene 28 dias

      if (currentMonth === 3) {
        const numberDay = numberDays - 1;
        newDay = 28 - numberDay;
        newMonth = currentMonth - 1;
        return `${currentYear}-${newMonth}-${newDay}`;
      }

      // si el mes es impar tiene 31 dias
      if (currentMonth % 2 === 0) {
        const numberDay = numberDays - 1;
        newDay = 31 - numberDay;
        newMonth = currentMonth > 1 ? currentMonth - 1 : 12;
        return `${currentYear}-${newMonth}-${newDay}`;
      }

      // si el mes par tiene 30 dias
      if (currentMonth % 2 === 1) {
        const numberDay = numberDays - 1;
        newDay = 30 - numberDay;
        newMonth = currentMonth > 1 ? currentMonth - 1 : 12;
        return `${currentYear}-${newMonth}-${newDay}`;
      }
    }
    if (currentDay > 2) {
      let daysMonth: number = 0;
      if (currentMonth === 1) {
        currentYear = currentYear - 1;
      }
      if (currentMonth === 2) {
        daysMonth = 28;
      }
      if (currentMonth % 2 === 0) {
        daysMonth = 31;
      }
      if (currentMonth % 2 === 1) {
        daysMonth = 30;
      }

      if (numberDays > 30) numberDays = 30;

      if (numberDays >= currentDay) {
        currentMonth = currentMonth - 1;
        newDay = currentDay - numberDays + daysMonth;
      } else {
        newDay = currentDay - numberDays;
      }

      if (currentMonth < 10) {
        currentMonth = `0${currentMonth}`;
      }
      if (newDay < 10) {
        newDay = `0${newDay}`;
      }

      if (numberDays > 0) return `${currentYear}-${currentMonth}-${newDay}`;
      else return "today";
    }
  };

  public async get(userToken: string): Promise<any> {
    let json;
    if (userToken != null || userToken != undefined) {
      try {
        const response = await fetch(
          "https://www.optecanalytics.com/api/sys/eval",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer authToken=${userToken}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              _kind: "grid",
              meta: { ver: "3.0" },
              cols: [{ name: "expr" }],
              rows: [{ expr: "projs()" }],
            }),
          }
        );

        json = await response.json();
      } catch (error) {
        /*console.log(
          'here, heystack.service.tsx line 134: without token or token old',
          error
        );*/
        // console.error(error);
      }
    }

    return json;
  }

  public async getUser(userToken: string): Promise<any> {
    const response = await fetch(
      "https://www.optecanalytics.com/api/sys/eval",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer authToken=${userToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _kind: "grid",
          meta: { ver: "3.0" },
          cols: [{ name: "expr" }],
          rows: [{ expr: "context()" }],
        }),
      }
    );
    const json = await response.json();
    return json;
  }

  public async getUserCur(userToken: string): Promise<any> {
    let json;
    try {
      const response = await fetch(
        "https://www.optecanalytics.com/api/sys/eval",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer authToken=${userToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            _kind: "grid",
            meta: { ver: "3.0" },
            cols: [{ name: "expr" }],
            rows: [{ expr: "userCur()" }],
          }),
        }
      );
      json = await response.json();
      return json;
    } catch (error) {
      //console.log('Error, here, heystack.service.tsx line 125:  getUserCur()');
      // console.error(error);
      return {};
    }
  }

  public async getSummary(dropDown: string, tokeprops?: string): Promise<any> {
    let json;

    try {
      const response = await fetch(
        `https://www.optecanalytics.com/api/${dropDown}/eval`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer authToken=${tokeprops}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            _kind: "grid",
            meta: { ver: "3.0" },
            cols: [{ name: "expr" }],
            rows: [{ expr: "apiGetSummary(today)" }],
          }),
        }
      );

      json = await response.json();

      if (json.rows.length === 0) {
        json = {
          _kind: "grid",
          cols: [
            {
              name: "name",
            },
            {
              name: "val",
            },
          ],
          meta: {
            ver: "3.0",
          },
          rows: [
            {
              name: "No Found",
              val: 0,
            },
            {
              name: "No_Found",
              val: {
                _kind: 0,
                unit: "",
                val: 0,
              },
            },
            {
              name: "No_Found",
              val: 0,
            },
          ],
        };
      }

      return json;
    } catch (error) {
      //console.log('here, heystack.service.tsx line 58: getSummary()', error);
    }
  }

  public async getIssues(dropDown: string, userToken: string): Promise<any> {
    let json;
    try {
      const response = await fetch(
        `https://www.optecanalytics.com/api/${dropDown}/eval`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer authToken=${userToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            _kind: "grid",
            meta: { ver: "3.0" },
            cols: [{ name: "expr" }],
            rows: [{ expr: "apiGetIssues(today)" }],
          }),
        }
      );

      json = await response.json();
      /*     console.log('json ', JSON.stringify(json.rows, null, 2)); */
    } catch (error) {
      //console.log('here, heystack.service.tsx line 87: getIssues');
    }

    return json;
  }

  public async apiGetIssue(
    dropDownId: string,
    issueId: string,
    equipmentCentOMId: string,
    userToken: string
  ): Promise<Equipment> {
    if (issueId === "" || issueId === undefined) {
      throw new Error("Invalid dropDownId");
    }
    if (equipmentCentOMId === "" || equipmentCentOMId === undefined) {
      throw new Error("Invalid equipmentCentOMId");
    }
    if (dropDownId === "" || dropDownId === undefined) {
      throw new Error("Invalid dropDownId");
    }

    const response = await fetch(
      `https://www.optecanalytics.com/api/${dropDownId}/eval`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer authToken=${userToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _kind: "grid",
          meta: { ver: "3.0" },
          cols: [{ name: "expr" }],
          rows: [
            { expr: `apiGetIssue(@${issueId},@${equipmentCentOMId},today)` },
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const json = await response.json();

    // console.log('responsesadsad', json.rows[0]);

    if (!json.rows || json.rows.length === 0) {
      throw new Error("Empty response or missing rows");
    }

    return json?.rows[0];
  }

  public async getSystems(dropDown: string, userToken: string): Promise<any> {
    let json;
    try {
      const response = await fetch(
        `https://www.optecanalytics.com/api/${dropDown}/eval`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer authToken=${userToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            _kind: "grid",
            meta: { ver: "3.0" },
            cols: [{ name: "expr" }],
            rows: [{ expr: "apiGetSystems()" }],
          }),
        }
      );

      json = await response.json();
    } catch (error) {
      //console.log('here, getSystems()');
    }

    return json;
  }

  public async getJobRequestSystems(
    dropDown: string,
    userToken: string
  ): Promise<any> {
    let json;
    try {
      const response = await fetch(
        `https://www.optecanalytics.com/api/${dropDown}/eval`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer authToken=${userToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            _kind: "grid",
            meta: { ver: "3.0" },
            cols: [{ name: "expr" }],
            rows: [{ expr: "apiGetJobRequestSystems()" }],
          }),
        }
      );

      json = await response.json();
    } catch (error) {
      //console.log('here, heystack.service.tsx getJobRequestSystems');
    }

    return json;
  }

  public async getJobRequestSubSystems(
    dropDown: string | undefined,
    systemId: string | undefined,
    userToken: string
  ): Promise<any> {
    let json;
    try {
      const response = await fetch(
        `https://www.optecanalytics.com/api/${dropDown}/eval`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer authToken=${userToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            _kind: "grid",
            meta: { ver: "3.0" },
            cols: [{ name: "expr" }],
            rows: [{ expr: `apiGetJobRequestSubSystems(@${systemId})` }],
          }),
        }
      );

      json = await response.json();
    } catch (error) {
      //console.log('here, heystack.service.tsx getJobRequestSubSystems');
    }

    return json;
  }

  public async getHvac(dropDown: string, userToken: string): Promise<any> {
    let json;
    try {
      const response = await fetch(
        `https://www.optecanalytics.com/api/${dropDown}/eval`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer authToken=${userToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            _kind: "grid",
            meta: { ver: "3.0" },
            cols: [{ name: "expr" }],
            rows: [{ expr: 'apiGetEquipments("hvac")' }],
          }),
        }
      );

      json = await response.json();
    } catch (error) {
      //console.log('here, heystack.service.tsx getHvac');
    }

    return json;
  }

  public async getEquimentRequest(
    dropDown: string,
    vTech: string,
    userToken: string
  ): Promise<any> {
    let json;
    try {
      const response = await fetch(
        `https://www.optecanalytics.com/api/${dropDown}/eval`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer authToken=${userToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            _kind: "grid",
            meta: { ver: "3.0" },
            cols: [{ name: "expr" }],
            rows: [{ expr: `apiGetEquipments("${vTech}")` }],
          }),
        }
      );

      json = await response.json();
    } catch (error) {
      //console.log('here, heystack.service.tsx getEquimentRequest');
    }

    return json;
  }

  public async getIaqRequest(
    dropDown: string,
    userToken: string
  ): Promise<any> {
    let json;
    try {
      const response = await fetch(
        `https://www.optecanalytics.com/api/${dropDown}/eval`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer authToken=${userToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            _kind: "grid",
            meta: { ver: "3.0" },
            cols: [{ name: "expr" }],
            rows: [{ expr: 'apiGetEquipments("iaq")' }],
          }),
        }
      );

      json = await response.json();
    } catch (error) {
      //console.log('here, heystack.service.tsx line 142: getIaqRequest');
    }

    return json;
  }

  public async getLiftStationRequest(
    dropDown: string,
    userToken: string
  ): Promise<any> {
    let json;
    try {
      const response = await fetch(
        `https://www.optecanalytics.com/api/${dropDown}/eval`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer authToken=${userToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            _kind: "grid",
            meta: { ver: "3.0" },
            cols: [{ name: "expr" }],
            rows: [{ expr: 'apiGetEquipments("liftStation")' }],
          }),
        }
      );

      json = await response.json();
    } catch (error) {
      //console.log('here, heystack.service.tsx line 142: getIaqRequest');
    }

    return json;
  }

  public async getWaterRequest(
    dropDown: string,
    userToken: string
  ): Promise<any> {
    let json;
    try {
      const response = await fetch(
        `https://www.optecanalytics.com/api/${dropDown}/eval`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer authToken=${userToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            _kind: "grid",
            meta: { ver: "3.0" },
            cols: [{ name: "expr" }],
            rows: [{ expr: 'apiGetEquipments("water")' }],
          }),
        }
      );

      json = await response.json();
    } catch (error) {
      //console.log('here, heystack.service.tsx  getWaterRequest');
    }

    return json;
  }

  public async getWaterDetectionRequest(
    dropDown: string,
    userToken: string
  ): Promise<any> {
    let json;
    try {
      const response = await fetch(
        `https://www.optecanalytics.com/api/${dropDown}/eval`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer authToken=${userToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            _kind: "grid",
            meta: { ver: "3.0" },
            cols: [{ name: "expr" }],
            rows: [{ expr: 'apiGetEquipments("flood")' }],
          }),
        }
      );

      json = await response.json();
    } catch (error) {
      //console.log('here, heystack.service.tsx getWaterDetectionRequest()');
    }

    return json;
  }

  public async getRefrigerationRequest(
    dropDown: string,
    userToken: string
  ): Promise<any> {
    let json;
    try {
      const response = await fetch(
        `https://www.optecanalytics.com/api/${dropDown}/eval`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer authToken=${userToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            _kind: "grid",
            meta: { ver: "3.0" },
            cols: [{ name: "expr" }],
            rows: [{ expr: 'apiGetEquipments("refrigeration")' }],
          }),
        }
      );

      json = await response.json();
    } catch (error) {
      //console.log('here, heystack.service.tsx getRefrigerationRequest');
    }

    return json;
  }

  public async getSecuritytionRequest(
    dropDown: string,
    userToken: string
  ): Promise<any> {
    let json;
    try {
      const response = await fetch(
        `https://www.optecanalytics.com/api/${dropDown}/eval`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer authToken=${userToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            _kind: "grid",
            meta: { ver: "3.0" },
            cols: [{ name: "expr" }],
            rows: [{ expr: 'apiGetEquipments("security")' }],
          }),
        }
      );

      json = await response.json();
    } catch (error) {
      //console.log('here, heystack.service.tsx getSecuritytionRequest');
    }

    return json;
  }

  public async getEquipmentPoints(
    dropDown: string,
    EquipmentID: string,
    userToken: string
  ): Promise<any> {
    let json;
    try {
      const response = await fetch(
        `https://www.optecanalytics.com/api/${dropDown}/eval`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer authToken=${userToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            _kind: "grid",
            meta: { ver: "3.0" },
            cols: [{ name: "expr" }],
            rows: [{ expr: `apiGetHvacPoints(@${EquipmentID})` }],
          }),
        }
      );

      json = await response.json();
    } catch (error) {
      //console.log('here, heystack.service.tsx getEquipmentPoints()');
    }

    return json;
  }
  public async getEquipmentById(
    dropDown: string,
    EquipmentID: string,
    userToken: string
  ): Promise<any> {
    let json;
    try {
      const response = await fetch(
        `https://www.optecanalytics.com/api/${dropDown}/eval`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer authToken=${userToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            _kind: "grid",
            meta: { ver: "3.0" },
            cols: [{ name: "expr" }],
            rows: [{ expr: `apiGetEquipmentById(@${EquipmentID})` }],
          }),
        }
      );
      /*   console.log(`responseeecardJob:${JSON.stringify(response)}`); */
      json = await response.json();
    } catch (error) {
      //console.log('here, heystack.service.tsx getEquipmentPoints()');
    }

    return json;
  }

  public async getEquipmentPointsByRows(
    dropDown: string,
    EquipmentID: string,
    userToken: string
  ): Promise<any> {
    if (EquipmentID === "" || EquipmentID === undefined) {
      return;
    }

    let json;
    try {
      const response = await fetch(
        `https://www.optecanalytics.com/api/${dropDown}/eval`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer authToken=${userToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            _kind: "grid",
            meta: { ver: "3.0" },
            cols: [{ name: "expr" }],
            rows: [
              {
                expr: `apiGetHvacPointsByRows(@${EquipmentID})`,
              },
            ],
          }),
        }
      );

      json = await response.json();

      //   '<<<<<< line 409 haystack_service.tsx  getEquipmentPointsByCells>>>>>>>'
      // );
    } catch (error) {
      //console.log('here, heystack.service.tsx getEquipmentPointsByRows()');
    }

    return json.rows;
  }

  public async apiGetWaterPointsByRows(
    dropDown: string,
    userToken: string
  ): Promise<any> {
    let json;
    try {
      const response = await fetch(
        `https://www.optecanalytics.com/api/${dropDown}/eval`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer authToken=${userToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            _kind: "grid",
            meta: { ver: "3.0" },
            cols: [{ name: "expr" }],
            rows: [
              {
                expr: `apiGetWaterPointsByRows()`,
              },
            ],
          }),
        }
      );

      json = await response.json();
      // console.log(
      //   '<<<<<< line 409 haystack_service.tsx  getEquipmentPointsByCells>>>>>>>'
      // );
    } catch (error) {
      console.log(
        "here, heystack.service.tsx line 409: apiGetWaterPointsByRows()"
      );
    }

    return json.rows;
  }

  public async getWater(dropDown: string, userToken: string): Promise<any> {
    let json;
    try {
      const response = await fetch(
        `https://www.optecanalytics.com/api/${dropDown}/eval`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer authToken=${userToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            _kind: "grid",
            meta: { ver: "3.0" },
            cols: [{ name: "expr" }],
            rows: [{ expr: "apiGetWaterPoints()" }],
          }),
        }
      );

      json = await response.json();
    } catch (error) {
      //console.log('here, heystack.service.tsx line 236: getWater');
    }

    return json;
  }

  public async getWaterDetection(
    dropDown: string,
    userToken: string
  ): Promise<any> {
    let json;
    try {
      const response = await fetch(
        `https://www.optecanalytics.com/api/${dropDown}/eval`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer authToken=${userToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            _kind: "grid",
            meta: { ver: "3.0" },
            cols: [{ name: "expr" }],
            rows: [{ expr: "apiGetWaterDetectionPoints()" }],
          }),
        }
      );

      json = await response.json();
    } catch (error) {
      //console.log('here, heystack.service.tsx line 236: getWaterDetection');
    }

    return json;
  }

  public async apiGetWaterDetectionPointsByRows(
    dropDown: string,
    userToken: string
  ): Promise<any> {
    let json;
    try {
      const response = await fetch(
        `https://www.optecanalytics.com/api/${dropDown}/eval`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer authToken=${userToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            _kind: "grid",
            meta: { ver: "3.0" },
            cols: [{ name: "expr" }],
            rows: [{ expr: "apiGetWaterDetectionPointsByRows()" }],
          }),
        }
      );

      json = await response.json();
      // console.log('<<<<<< line 262 haystack_service.tsx getWaterDetection>>>>>>>')
      // console.log(json);
    } catch (error) {
      console.log(
        "here, heystack.service.tsx: apiGetWaterDetectionPointsByRows()"
      );
    }

    return json.rows;
  }

  public async apiGetRefrigerationPointsByRows(
    dropDown: string,
    userToken: string
  ): Promise<any> {
    let json;
    try {
      const response = await fetch(
        `https://www.optecanalytics.com/api/${dropDown}/eval`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer authToken=${userToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            _kind: "grid",
            meta: { ver: "3.0" },
            cols: [{ name: "expr" }],
            rows: [{ expr: "apiGetRefrigerationPointsByRows()" }],
          }),
        }
      );

      json = await response.json();
      // console.log('<<<<<< line 262 haystack_service.tsx getWaterDetection>>>>>>>')
      // console.log(json);
    } catch (error) {
      console.log(
        "here, heystack.service.tsx: apiGetRefrigerationPointsByRows()"
      );
    }

    return json.rows;
  }

  public async apiGetIaqPointsByRows(
    dropDown: string,
    userToken: string
  ): Promise<any> {
    let json;
    try {
      const response = await fetch(
        `https://www.optecanalytics.com/api/${dropDown}/eval`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer authToken=${userToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            _kind: "grid",
            meta: { ver: "3.0" },
            cols: [{ name: "expr" }],
            rows: [{ expr: "apiGetIaqPointsByRows()" }],
          }),
        }
      );

      json = await response.json();
      // console.log('<<<<<< line 262 haystack_service.tsx getWaterDetection>>>>>>>')
      // console.log("ROWS LLEGANDO DEL BACK", json);
    } catch (error) {
      console.log("here, heystack.service.tsx: apiGetIaqPointsByRows()");
    }

    return json.rows;
  }

  public async apiGetLiftStationPointsByRows(
    dropDown: string,
    userToken: string
  ): Promise<Category[]> {
    let json;
    try {
      const response = await fetch(
        `https://www.optecanalytics.com/api/${dropDown}/eval`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer authToken=${userToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            _kind: "grid",
            meta: { ver: "3.0" },
            cols: [{ name: "expr" }],
            rows: [{ expr: "apiGetLiftStationPointsByRows()" }],
          }),
        }
      );

      json = await response.json();
      // console.log('<<<<<< line 262 haystack_service.tsx getWaterDetection>>>>>>>')
      // console.log("ROWS LLEGANDO DEL BACK", json);
    } catch (error) {
      console.log(
        "here, heystack.service.tsx: apiGetLiftStationPointsByRows()"
      );
    }

    return json.rows;
  }

  public async apiGetBuildingPressurizationPointsByRows(
    dropDown: string,
    userToken: string
  ): Promise<Category[]> {
    let json;
    try {
      const response = await fetch(
        `https://www.optecanalytics.com/api/${dropDown}/eval`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer authToken=${userToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            _kind: "grid",
            meta: { ver: "3.0" },
            cols: [{ name: "expr" }],
            rows: [{ expr: "apiGetBuildingPressurizationPointsByRows()" }],
          }),
        }
      );

      json = await response.json();
      // console.log('<<<<<< line 262 haystack_service.tsx getWaterDetection>>>>>>>')
    } catch (error) {
      console.log("Error en apiGetBuildingPressurizationPointsByRows", error);
    }
    return json.rows;
  }

  public async apiGetFumeHoodPointsByRows(
    dropDown: string,
    userToken: string
  ): Promise<Category[]> {
    let json;
    try {
      const response = await fetch(
        `https://www.optecanalytics.com/api/${dropDown}/eval`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer authToken=${userToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            _kind: "grid",
            meta: { ver: "3.0" },
            cols: [{ name: "expr" }],
            rows: [{ expr: "apiGetFumeHoodPointsByRows()" }],
          }),
        }
      );

      json = await response.json();
    } catch (error) {
      console.log("Error en apiGetFumeHoodPointsByRows", error);
    }
    return json.rows;
  }

  public async apiGetScrubberPointsByRows(
    dropDown: string,
    userToken: string
  ): Promise<Category[]> {
    let json;
    try {
      const response = await fetch(
        `https://www.optecanalytics.com/api/${dropDown}/eval`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer authToken=${userToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            _kind: "grid",
            meta: { ver: "3.0" },
            cols: [{ name: "expr" }],
            rows: [{ expr: "apiGetScrubberPointsByRows()" }],
          }),
        }
      );
      json = await response.json();
    } catch (error) {
      console.log("Error en apiGetScrubberPointsByRows", error);
    }
    return json.rows;
  }

  public async apiGetElectricPointsByRows(
    dropDown: string,
    userToken: string
  ): Promise<Category[]> {
    let json;
    try {
      const response = await fetch(
        `https://www.optecanalytics.com/api/${dropDown}/eval`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer authToken=${userToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            _kind: "grid",
            meta: { ver: "3.0" },
            cols: [{ name: "expr" }],
            rows: [{ expr: "apiGetElectricPointsByRows()" }],
          }),
        }
      );
      json = await response.json();
    } catch (error) {
      console.log("Error en apiGetElectricPointsByRows", error);
    }
    return json.rows;
  }

  public async apiGetSecurityPointsByRows(
    dropDown: string,
    userToken: string
  ): Promise<any> {
    let json;
    try {
      const response = await fetch(
        `https://www.optecanalytics.com/api/${dropDown}/eval`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer authToken=${userToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            _kind: "grid",
            meta: { ver: "3.0" },
            cols: [{ name: "expr" }],
            rows: [{ expr: "apiGetSecurityPointsByRows()" }],
          }),
        }
      );

      json = await response.json();
      // console.log('<<<<<< line 262 haystack_service.tsx getWaterDetection>>>>>>>')
      // console.log('ROWS LLEGANDO DEL BACK', json);
    } catch (error) {
      console.log("here, heystack.service.tsx: apiGetSecurityPointsByRows()");
    }

    return json.rows;
  }

  public async getRefrigeration(
    dropDown: string,
    userToken: string
  ): Promise<any> {
    let json;
    try {
      const response = await fetch(
        `https://www.optecanalytics.com/api/${dropDown}/eval`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer authToken=${userToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            _kind: "grid",
            meta: { ver: "3.0" },
            cols: [{ name: "expr" }],
            rows: [{ expr: "apiGetRefrigerationPoints()" }],
          }),
        }
      );

      json = await response.json();
    } catch (error) {
      console.log("here, heystack.service.tsx line 236: Refrigeration");
    }

    return json;
  }

  public async getIaq(dropDown: string, userToken: string): Promise<any> {
    let json;
    try {
      const response = await fetch(
        `https://www.optecanalytics.com/api/${dropDown}/eval`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer authToken=${userToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            _kind: "grid",
            meta: { ver: "3.0" },
            cols: [{ name: "expr" }],
            rows: [{ expr: "apiGetIaqPoints()" }],
          }),
        }
      );

      json = await response.json();
    } catch (error) {
      console.log("here, heystack.service.tsx line 236: Refrigeration");
    }

    return json;
  }

  public async getLiftStation(
    dropDown: string,
    userToken: string
  ): Promise<any> {
    let json;
    try {
      const response = await fetch(
        `https://www.optecanalytics.com/api/${dropDown}/eval`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer authToken=${userToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            _kind: "grid",
            meta: { ver: "3.0" },
            cols: [{ name: "expr" }],
            rows: [{ expr: "apiGetLiftStationPoints()" }],
          }),
        }
      );

      json = await response.json();
    } catch (error) {
      console.log("here, heystack.service.tsx line 1157: Lift Station");
    }

    return json;
  }

  public async getSecurity(dropDown: string, userToken: string): Promise<any> {
    let json;
    try {
      const response = await fetch(
        `https://www.optecanalytics.com/api/${dropDown}/eval`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer authToken=${userToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            _kind: "grid",
            meta: { ver: "3.0" },
            cols: [{ name: "expr" }],
            rows: [{ expr: "apiGetSecurityPoints()" }],
          }),
        }
      );

      json = await response.json();
    } catch (error) {
      console.log("here, heystack.service.tsx line 236: Refrigeration");
    }

    return json;
  }

  public async getChart(
    dropDown: string,
    id: string | undefined,
    range: string | undefined,
    userToken: string
  ): Promise<any> {
    let json;

    try {
      const response = await fetch(
        `https://www.optecanalytics.com/api/${dropDown}/eval`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer authToken=${userToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            _kind: "grid",
            meta: { ver: "3.0" },
            cols: [{ name: "expr" }],
            rows: [{ expr: `apiGetPointHistory(@${id},${range})` }],
          }),
        }
      );

      json = await response.json();
      // console.log('response JSON:', json);
    } catch (error) {
      console.log("here, heystack.service.tsx line 236: getChart", error);
    }

    return json;
  }

  public async getChartMultipoint(
    dropDown: string,
    array: string[],
    numberDays: any | undefined,
    userToken: string
  ): Promise<any> {
    let json;
    let range: any;

    if (numberDays !== 0) range = `${numberDays}..${numberDays}`;
    if (numberDays === 0) range = "today";
    if (numberDays === undefined) range = "today";

    const atsignAdded = array.map((el) => {
      return "@" + el;
    });
    console.log("atsignAdded", `apiGetPointsHistory([${atsignAdded}],today)`);

    try {
      const response = await fetch(
        `https://www.optecanalytics.com/api/${dropDown}/eval`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer authToken=${userToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            _kind: "grid",
            meta: { ver: "3.0" },
            cols: [{ name: "expr" }],
            rows: [{ expr: `apiGetPointsHistory([${atsignAdded}],${range})` }],
          }),
        }
      );

      json = await response.json();
      // console.log('json', json);

      return json;
    } catch (error) {
      console.log("here, heystack.service.tsx : getChartMultipoint(${}, )");
    }
  }

  public getProjects(userToken: string): Promise<any> {
    let response: Promise<any> = this.get(userToken).then((data) => {
      return (response = data);
    });

    return response;
  }

  public async apiGetJobRequestNav(
    dropDown: string,
    userToken: string
  ): Promise<any> {
    if (dropDown === undefined) {
      console.log("dropDown is undefined in apiGetJobRequestNav()");

      return;
    }
    if (userToken === undefined) {
      console.log("userToken is undefined in apiGetJobRequestNav()");
      return;
    }

    let json;
    try {
      const response = await fetch(
        `https://www.optecanalytics.com/api/${dropDown.replace("p:", "")}/eval`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer authToken=${userToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            _kind: "grid",
            meta: { ver: "3.0" },
            cols: [{ name: "expr" }],
            rows: [{ expr: "apiGetJobRequestNav()" }],
          }),
        }
      );

      json = await response.json();
      return json.rows[0].val;
    } catch (error) {
      console.log("here, heystack.service.tsx line 236: Refrigeration");
    }
  }

  public async getIssuesNav(dropDown: string, userToken: string): Promise<any> {
    let json;

    try {
      const response = await fetch(
        `https://www.optecanalytics.com/api/${dropDown}/eval`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer authToken=${userToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            _kind: "grid",
            meta: { ver: "3.0" },
            cols: [{ name: "expr" }],
            rows: [{ expr: "apiGetIssuesNav()" }],
          }),
        }
      );

      json = await response.json();
      // console.log('json ', JSON.stringify(json.rows[0], null, '\t'));
      return json.rows[0].val;
    } catch (error) {
      console.log("Error in getIssuesNav", error);
    }
  }
  public async getRoomsOoo(
    dropDown: string,
    getServiceType: string,
    userToken: string
  ) {
    try {
      const services = await fetch(
        `https://www.optecanalytics.com/api/${dropDown}/eval`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer authToken=${userToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            _kind: "grid",
            meta: { ver: "3.0" },
            cols: [{ name: "expr" }],
            rows: [{ expr: `apiGetRoomsOoo("${getServiceType}")` }],
          }),
        }
      );

      let json = await services.json();

      if (json.rows.length === 0) {
        const emptyJson: Rooms = {
          message: "Error",
          requestStatus: "Error",
          roomNumbers: [],
          roomDate: [],
          roomReason: [],
        };
        return emptyJson;
      } else return json.rows[0];
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  public postRoomsOoo = async (
    dropDown: string,
    date: any,
    arrayRooms: any[],
    serviceType: string,
    detail: string,
    userToken: string
  ) => {
    const sizeArray = arrayRooms.length;
    const arrayRoomsNew = `[${arrayRooms
      .map((e, i) => {
        i = i + 1;
        if (sizeArray === 1) return `"${e}"`;
        else if (sizeArray > 1 && i < sizeArray) return `"${e}`;
        else if (i === sizeArray) return `"${e}"`;
      })
      .join('",')}]`;
    try {
      const services = await fetch(
        `https://www.optecanalytics.com/api/${dropDown}/eval`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer authToken=${userToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            _kind: "grid",
            meta: { ver: "3.0" },
            cols: [{ name: "expr" }],
            rows: [
              {
                // expr: `apiPostRoomOoo("${date}",['202B'],"${serviceType}","${detail}")`
                expr: `apiPostRoomOoo("${date}",${arrayRoomsNew},"${serviceType}","${detail}")`,
              },
            ],
          }),
        }
      );

      let json = await services.json();
      // console.log(json);
      return json.rows[0];
    } catch (error) {
      console.log(error);
      return error;
    }
  };
  public getRoomsOooHistory = async (
    dropDown: string,
    initialDate: any,
    finalDate: any,
    userToken: string
  ) => {
    try {
      const services = await fetch(
        `https://www.optecanalytics.com/api/${dropDown}/eval`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer authToken=${userToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            _kind: "grid",
            meta: { ver: "3.0" },
            cols: [{ name: "expr" }],
            rows: [
              {
                // expr: `apiPostRoomOoo("${date}",['202B'],"${serviceType}","${detail}")`
                expr: `apiGetRoomsOooHistory("${initialDate}","${finalDate}")`,
              },
            ],
          }),
        }
      );

      let json = await services.json();

      return json.rows[0];
    } catch (error) {
      console.log(error);
      return error;
    }
  };
}
