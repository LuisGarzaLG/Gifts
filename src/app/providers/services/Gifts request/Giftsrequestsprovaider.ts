import { Injectable } from "@angular/core";
import { BaseProvider } from "../base.provider";
import { BehaviorSubject } from "rxjs";
import { HttpResponse } from "@angular/common/http";
import { NotificationService } from "../notification/notification.service";
import { ApiService } from "../api.provider"; // Asegúrate de importar ApiService
import { ToastrProvider } from "../../toastr/toastr-service"; // Asegúrate de importar ToastrProvider
import { TokenStorageService } from "../security/token-storage.service"; // Asegúrate de importar TokenStorageService


@Injectable({ providedIn: "root" })
export class qualityrequestsprovaider extends BaseProvider {
    constructor(
        private notificationService: NotificationService,
        baseService: ApiService,
        toastService: ToastrProvider,
        tokenStorageService: TokenStorageService
    ) {
        super(baseService, toastService, tokenStorageService); // Pasando los parámetros al constructor de la clase base
    }


    
    
    
}





