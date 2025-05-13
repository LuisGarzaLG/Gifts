import { Injectable } from "@angular/core";
import { BaseProvider } from "../base.provider";
import { BehaviorSubject } from "rxjs";
import { HttpResponse } from "@angular/common/http";
import { NotificationService } from "../notification/notification.service";
import { ApiService } from "../api.provider"; // Asegúrate de importar ApiService
import { ToastrProvider } from "../../toastr/toastr-service"; // Asegúrate de importar ToastrProvider
import { TokenStorageService } from "../security/token-storage.service"; // Asegúrate de importar TokenStorageService
import { Employee } from "../../models/gifts-request-all-models";


@Injectable({ providedIn: "root" })
export class giftsrequestsprovaider extends BaseProvider {
    constructor(
        private notificationService: NotificationService,
        baseService: ApiService,
        toastService: ToastrProvider,
        tokenStorageService: TokenStorageService
    ) {
        super(baseService, toastService, tokenStorageService); // Pasando los parámetros al constructor de la clase base
    }

    private endpointGetAllEmployees = '/RhGifts/GetAllEmployees';
    private endpointAddNewEmployee = '/RhGifts/AddNewEmployee'

    public async GetAllEmployees(): Promise<Employee[]> {
    return await this.service.Get<Employee[]>(this.endpointGetAllEmployees)
        .then((data: HttpResponse<Employee[]>) => {
        return data.body || [];
        });
    }

    public async AddNewEmployee(employee: Employee): Promise<any> {
  return await this.service.Post<any>(this.endpointAddNewEmployee, employee)
    .then((data: HttpResponse<any>) => {
      return data.body;
    });
}


    
    
    
}





