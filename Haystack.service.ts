// Haystack.service.ts

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
    const headers = new Headers({
      "Content-Type": "application/x-www-form-urlencoded",
    });

    const body = new URLSearchParams();
    body.append("u", u);
    body.append("p", p);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: body,
      });

      const data = await response.text(); // or response.json() if the response is JSON
      console.log("data: ", data);
      return data;
    } catch (error) {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    }
  }

  public async get(userToken: string): Promise<any> {
    if (!userToken) {
      return;
    }

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

      const json = await response.json();
      return json;
    } catch (error) {
      console.error("Error in get:", error);
    }
  }

  public async getUser(userToken: string): Promise<any> {
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
            rows: [{ expr: "context()" }],
          }),
        }
      );
      const json = await response.json();
      return json;
    } catch (error) {
      console.error("Error in getUser:", error);
    }
  }

  public async getUserCur(userToken: string): Promise<any> {
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
      const json = await response.json();
      return json;
    } catch (error) {
      console.error("Error in getUserCur:", error);
      return {};
    }
  }

  public async getSummary(dropDown: string, tokenProps?: string): Promise<any> {
    try {
      const response = await fetch(
        `https://www.optecanalytics.com/api/${dropDown}/eval`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer authToken=${tokenProps}`,
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

      let json = await response.json();

      if (json.rows.length === 0) {
        json = {
          _kind: "grid",
          cols: [{ name: "name" }, { name: "val" }],
          meta: { ver: "3.0" },
          rows: [
            { name: "No Found", val: 0 },
            { name: "No_Found", val: { _kind: 0, unit: "", val: 0 } },
            { name: "No_Found", val: 0 },
          ],
        };
      }

      return json;
    } catch (error) {
      console.error("Error in getSummary:", error);
    }
  }

  public async getIssues(dropDown: string, userToken: string): Promise<any> {
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

      const json = await response.json();
      return json;
    } catch (error) {
      console.error("Error in getIssues:", error);
    }
  }

  public async apiGetIssue(
    dropDownId: string,
    issueId: string,
    equipmentCentOMId: string,
    userToken: string
  ): Promise<Equipment> {
    if (!issueId || !equipmentCentOMId || !dropDownId) {
      throw new Error("Invalid input parameters");
    }

    try {
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

      if (!json.rows || json.rows.length === 0) {
        throw new Error("Empty response or missing rows");
      }

      return json.rows[0];
    } catch (error) {
      console.error("Error in apiGetIssue:", error);
      throw error;
    }
  }

  public async getSystems(dropDown: string, userToken: string): Promise<any> {
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

      const json = await response.json();
      return json;
    } catch (error) {
      console.error("Error in getSystems:", error);
    }
  }
}
