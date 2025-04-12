class Products {
    endpoint;
    constructor(parameters) {
        this.endpoint = process.env.NEXT_PUBLIC_API_URI + "/product"
    }

    async addProduct(data){
        try {
            let token = localStorage.getItem("AdminToken");
            let res = await fetch(`${this.endpoint}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            if(res.status === 201){
                return await res.json()
            }else{
                return {
                    error: await res.json()
                }
            }
        } catch (error) {
            return error
        }
    }
}

const productServices = new Products();

export default productServices;