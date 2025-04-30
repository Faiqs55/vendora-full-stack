class Products {
  endpoint;
  token;
  constructor(parameters) {
    this.endpoint = process.env.NEXT_PUBLIC_API_URI + "/product";
  }

  async addProduct(data) {
    const token = localStorage.getItem("AdminToken");
    try {
      if (!token) {
        return;
      }
      let res = await fetch(`${this.endpoint}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (res.status === 201) {
        return await res.json();
      } else {
        return {
          error: await res.json(),
        };
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async getAllProducts(page = 1, limit = 8) {
    const token = localStorage.getItem("AdminToken");
    try {
      if (!token) {
        return;
      }
      const res = await fetch(`${this.endpoint}?page=${page}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (res.status === 200) {
        return await res.json();
      } else {
        return {
          error: await res.json(),
        };
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async getSingleProduct(id) {
    try {
      const res = await fetch(`${this.endpoint}/${id}`);
      if (res.status === 200) {
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

  async updateProduct(id, data) {    
    try {
      const token = localStorage.getItem("AdminToken");
      const res = await fetch(`${this.endpoint}/${id}`, {
        method: "put",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
      });      

      if (res.status === 202) {
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

  async deleteProduct(id) {
    try {
      const token = localStorage.getItem("AdminToken");
      const res = await fetch(`${this.endpoint}/${id}`, {
        method: "delete",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 202) {
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
}

const productServices = new Products();

export default productServices;
