import { ChangeDetectionStrategy, Component, effect, inject, input, OnInit, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { GuideHttpService } from '@/pages/core/roles/external/services';
import { ClassificationInterface } from '@/pages/core/shared/interfaces';
import { Message } from 'primeng/message';
import { CatalogueInterface } from '@utils/interfaces';
import { FontAwesome } from '@/pages/public/icons/font-awesome';
import { NgClass } from '@angular/common';
import { TableModule } from 'primeng/table';
import { environment } from '@env/environment';
import { Select } from 'primeng/select';
import { CatalogueTypeEnum } from '@utils/enums';
import { CatalogueService } from '@utils/services/catalogue.service';
import { CatalogueGuideClassificationsCodeEnum } from '@/pages/core/shared/components/regulation-simulator/enum';

interface RequirementConfiguration {
    requirement: CatalogueInterface;
    option: boolean;
    requiredRegister: boolean;
}

@Component({
    selector: 'app-guide',
    imports: [ToggleSwitchModule, ReactiveFormsModule, Message, NgClass, TableModule, Select],
    templateUrl: './guide.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GuideComponent implements OnInit {
    private readonly guideHttpService = inject(GuideHttpService);
    classification = input.required<ClassificationInterface>();
    items = signal<RequirementConfiguration[]>([]);
    private readonly catalogueService = inject(CatalogueService);
    option = new FormControl(false);
    type = new FormControl<CatalogueInterface>({});
    types: CatalogueInterface[] = [];
    definition: string = '';

    constructor() {
        effect(() => {
            this.findRequirementConfigurations();
            this.configureDefinition();
        });
    }

    async ngOnInit() {
        await this.loadCatalogues();

        this.configureDefinition();

        this.type.valueChanges.subscribe((value) => {
            if (value) this.findRequirementConfigurations();
        });
    }

    findRequirementConfigurations() {
        this.guideHttpService.findRequirementConfigurations(this.classification()?.id!, this.type.value?.code!).subscribe({
            next: (response) => {
                const data = response.map((item) => {
                    return {
                        requirement: item.requirement,
                        option: false,
                        requiredRegister: item.required_register
                    };
                });

                this.items.set(response);
            }
        });
    }

    async loadCatalogues() {
        this.types = await this.catalogueService.findByType(CatalogueTypeEnum.process_guides_professional_type);

        this.findRequirementConfigurations();
    }

    configureDefinition() {
        switch (this.classification().code) {
            case CatalogueGuideClassificationsCodeEnum.guide_local: {
                this.definition =
                    'Guía de turismo local:  El guía de turismo local es la persona natural que acredita conocimiento para proporcionar a los turistas o visitantes información detallada respecto del valor turístico natural y cultural del cantón para el cual se acreditó en esta clasificación. Como parte de su actividad podrá realizar senderismo que no requiera el uso de equipo especializado de alta montaña, espeleología, cabalgata, cicloturismo y las demás que determine la Autoridad Nacional de Turismo.';
                break;
            }
            case CatalogueGuideClassificationsCodeEnum.guide_national: {
                this.definition =
                    'Guía de turismo nacional.- El guía de turismo nacional es la persona natural que ha obtenido título profesional de guía de turismo; o, cuenta con un título en campos de conocimiento afines a la guianza turística, de tercer nivel, otorgado por una institución de educación superior nacional o extranjera, el mismo que ha sido registrado ante la autoridad competente.';
                break;
            }
            case CatalogueGuideClassificationsCodeEnum.guide_national_heritage: {
                this.definition =
                    'Guía de turismo nacional especializado en patrimonio turístico.- El guía de turismo nacional especializado en patrimonio turístico es la persona natural que ha obtenido un título profesional de guía de turismo; o, cuenta con un título en campos de conocimiento afines a la guianza turística, de tercer nivel, otorgado por una institución de educación superior nacional o extranjera, registrado ante la autoridad competente; y, adicionalmente, cumple con los requisitos para acreditarse y ejercer la guianza en patrimonio turístico de acuerdo al presente reglamento.';
                break;
            }
            case CatalogueGuideClassificationsCodeEnum.guide_national_adventure: {
                this.definition =
                    'Guía de turismo nacional especializado en aventura.- El guía de turismo nacional especializado en aventura es la persona natural que ha obtenido un título profesional de guía de turismo; o, cuenta con un título en campos de conocimiento afines a la guianza turística, de tercer nivel, otorgado por una institución de educación superior nacional o extranjera, reconocido por la autoridad competente; y, adicionalmente, cumple con los requisitos para acreditarse y ejercer la guianza en una o varias modalidades de aventura, de acuerdo al presente reglamento.';
                break;
            }
            case CatalogueGuideClassificationsCodeEnum.guide_adventure: {
                this.definition =
                    'Guía de turismo en aventura.- El guía de turismo en aventura es la persona natural que cuenta con al menos título de bachiller y cumple con los requisitos para acreditarse y ejercer la guianza en una o varias modalidades de aventura, de acuerdo al presente reglamento.';
                break;
            }
        }
    }
    protected readonly FontAwesome = FontAwesome;
    protected readonly environment = environment;
}
