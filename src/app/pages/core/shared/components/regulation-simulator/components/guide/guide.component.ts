import { ChangeDetectionStrategy, Component, effect, inject, input, OnInit, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { GuideHttpService } from '@/pages/core/roles/external/services';
import { ClassificationInterface } from '@/pages/core/shared/interfaces';
import { Message } from 'primeng/message';
import { CatalogueInterface } from '@utils/interfaces';
import { ToggleSwitchComponent } from '@utils/components/toggle-switch/toggle-switch.component';
import { Divider } from 'primeng/divider';
import { FormField } from '@angular/forms/signals';
import { FontAwesome } from '@/pages/public/icons/font-awesome';
import { NgClass } from '@angular/common';
import { TableModule } from 'primeng/table';
import { environment } from '@env/environment';
import { Select } from 'primeng/select';
import { CatalogueTypeEnum } from '@utils/enums';
import { CatalogueService } from '@utils/services/catalogue.service';

interface RequirementConfiguration {
    requirement: CatalogueInterface;
    option: boolean;
    requiredRegister: boolean;
}

@Component({
    selector: 'app-guide',
    imports: [ToggleSwitchModule, ReactiveFormsModule, Message, ToggleSwitchComponent, Divider, FormField, NgClass, TableModule, Select],
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

    constructor() {
        effect(() => {
            this.findRequirementConfigurations();
        });
    }

    async ngOnInit() {
        await this.loadCatalogues();

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
    protected readonly FontAwesome = FontAwesome;
    protected readonly environment = environment;
}
