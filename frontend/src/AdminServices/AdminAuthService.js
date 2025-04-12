class AdminAuth {
  endpoint;
  constructor(parameters) {
    this.endpoint = process.env.NEXT_PUBLIC_API_URI + "/auth";
  }

  async registerUser({ name, email, password, storeName }) {
    try {
      const userData = {
        name,
        email,
        password,
        storeName,
        role: "vendor",
      };
      const res = await fetch(`${this.endpoint}/register`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      if (res.status === 201) {
        return await res.json();
      } else {
        return {
          error: await res.json(),
        };
      }
    } catch (error) {
      return error;
    }
  }

  async loginUser({ email, password }) {
    try {
      let userData = {
        email,
        password,
      };

      const res = await fetch(`${this.endpoint}/login`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (res.status === 200) {
        let response = await res.json();
        localStorage.setItem("AdminToken", response.token);
        return response;
      } else {
        return {
          error: await res.json(),
        };
      }
    } catch (error) {
      return error;
    }
  }

  async getCurrentUser(){
    try {
      let userToken = localStorage.getItem("AdminToken");
      if(userToken){
        let res = await fetch(`${this.endpoint}/user`, {
          method: "get",
          headers: {
            "Authorization": `Bearer ${userToken}`
          }
        })

        if(res.status === 200){
          return await res.json();
        }else{
          return {
            error: await res.json()
          }
        }
      }else{
        throw new Error("No Token available");
      }
    } catch (error) {
      console.log(error);
    }
  }
}

const adminAuthService = new AdminAuth();

export default adminAuthService;
