const { StatusCodes } = require("http-status-codes");
const AppError = require("../utils/errors/app-error");

class CrudRepository {

    constructor(model) {
        this.model = model;
    }

    async create(data) {
                                                                      
        const response = await this.model.create(data); //No need to use try and catch as error get stored in 'response' which returns to service 
        return response;                                //and then handled there
    }



    async destroy(data) {
       
        const response = await this.model.destroy({
            where: {
                id: data
                }
            });
            if(!response) {                   // means if response is empty (data not present for that id), then it throws this error
                throw new AppError('Not able to find the resource', StatusCodes.NOT_FOUND);
            }
            return response;
    }



    async get(data) {
        const response = await this.model.findByPk(data);
        if(!response) {                        // means if response is empty (data not present for that id), then it throws this error
            throw new AppError('Not able to find the resource', StatusCodes.NOT_FOUND);
        }
        return response;
    }



    async getAll() {
        const response = await this.model.findAll();
        return response;
    }



    async update(id, data) {  // data is object - { col: value..}
        
        const response = await this.model.update(data, {
            where: {
                    id: id
            }
        });
        console.log("This is Update response -> ", response);  //if update not happens it returns this -> [0] , a array which contain only one element 0
        console.log("Its lenght -> ", response.length);        // whose length is 1 , if update happens -> [1], array contain one element 1
        
        if(response.length === 1 && response[0] === 0) {
            throw new AppError('Not able to find the resource to update', StatusCodes.NOT_FOUND);
        }
        return response;
    }
}

module.exports = CrudRepository;