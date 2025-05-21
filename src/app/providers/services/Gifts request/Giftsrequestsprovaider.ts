import { Injectable } from "@angular/core";
import { BaseProvider } from "../base.provider";
import { BehaviorSubject } from "rxjs";
import { HttpResponse } from "@angular/common/http";
import { NotificationService } from "../notification/notification.service";
import { ApiService } from "../api.provider";
import { ToastrProvider } from "../../toastr/toastr-service";
import { TokenStorageService } from "../security/token-storage.service";
import { Concept, Employee, Report } from "../../models/gifts-request-all-models";

@Injectable({ providedIn: "root" })
export class giftsrequestsprovaider extends BaseProvider {
  constructor(
    private notificationService: NotificationService,
    baseService: ApiService,
    toastService: ToastrProvider,
    tokenStorageService: TokenStorageService
  ) {
    super(baseService, toastService, tokenStorageService);
  }

  private endpointGetAllEmployees = '/api/gifts/getallemployees';
  private endpointGetAllReportasync = '/api/gifts/getallreportsasync';
  private endpointGetAllConcepts = '/api/gifts/getallconcepts';
  private endpointUpdateConcept = '/api/gifts/updateconcept';
  private endpointAddConcept = '/api/gifts/addconcept';

  public async GetAllEmployees(): Promise<Employee[]> {
    return await this.service.Get<Employee[]>(this.endpointGetAllEmployees)
      .then((data: HttpResponse<Employee[]>) => data.body || []);
  }

  public async GetAllReports(): Promise<Report[]> {
    return await this.service.Get<Report[]>(this.endpointGetAllReportasync)
      .then((data: HttpResponse<Report[]>) => data.body || []);
  }

  private employeesCache$ = new BehaviorSubject<Employee[] | null>(null);

  public get employees$() {
    return this.employeesCache$.asObservable();
  }

  public async LoadEmployees(forceReload: boolean = false): Promise<void> {
    if (this.employeesCache$.getValue() && !forceReload) return;

    try {
      const response = await this.service.Get<Employee[]>(this.endpointGetAllEmployees);
      const data = response.body || [];
      this.employeesCache$.next(data);
    } catch (error) {
      console.error('Error loading employees:', error);
      this.notificationService.error('Error al cargar empleados');
    }
  }

  private conceptsCache$ = new BehaviorSubject<Concept[] | null>(null);

  public get concepts$() {
    return this.conceptsCache$.asObservable();
  }

  public async GetAllConcepts(): Promise<Concept[]> {
    const cached = this.conceptsCache$.getValue();
    if (cached) return cached;

    return await this.service.Get<Concept[]>(this.endpointGetAllConcepts)
      .then((data: HttpResponse<Concept[]>) => {
        const concepts = data.body || [];
        this.conceptsCache$.next(concepts);
        return concepts;
      });
  }

  public ClearConceptsCache() {
    this.conceptsCache$.next(null);
  }

  public async refreshConcepts(): Promise<void> {
    try {
      const response = await this.service.Get<Concept[]>(this.endpointGetAllConcepts);
      let concepts = response.body || [];
      concepts = concepts.sort((a: Concept, b: Concept) => (a.name?.toLowerCase() || '').localeCompare(b.name?.toLowerCase() || ''));
      this.conceptsCache$.next(concepts);
    } catch (error) {
      console.error('Error al refrescar conceptos:', error);
      this.notificationService.error('Error al cargar conceptos');
    }
  }

  public async UpdateConcept(concept: Concept): Promise<void> {
    await this.service.Put1<void>(this.endpointUpdateConcept, concept);
    await this.refreshConcepts();
  }

  public async AddConcept(concept: Concept): Promise<number | undefined> {
  console.log('POST a AddConcept con:', concept);

  try {
    const response = await this.service.Post<{ id: number }>(this.endpointAddConcept, concept);
    if (response.status >= 200 && response.status <= 299) {
      this.notificationService.info('Concepto añadido con éxito');
      await this.refreshConcepts();
      return response.body?.id;
    } else {
      console.warn('Respuesta inesperada del servidor:', response);
      this.notificationService.warning('Ocurrió un problema al añadir el concepto');
      return undefined;
    }
  } catch (error) {
    console.error('Error al añadir concepto:', error);
    this.notificationService.error('Error al comunicarse con el servidor');
    return undefined;
  }
}

}
