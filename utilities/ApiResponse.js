class ApiRespose{constructor(status, data, messgae, success){
     this.status=status,
     this.data=data,
     this.messgae= messgae,
     this.success= status<400

}}
export  default ApiRespose